package genai

import (
	"context"
	"encoding/json"
	"fmt"
	"go-gin-backend/internal/models"
	"strings"

	"google.golang.org/genai"
	"gorm.io/gorm"
)

// GenerateProjections generates financial projections for a business
func (s *Service) GenerateProjections(businessID uint, isRefresh bool) (*ProjectionsResponse, error) {
	ctx := context.Background()

	// Return cached if exists (and not refresh)
	if !isRefresh {
		var existing models.BusinessProjection
		if err := s.DB.Preload("Items").
			Where("business_id = ?", businessID).
			Order("created_at DESC").
			First(&existing).Error; err == nil {
			// Build response from cached DB record
			resp := ProjectionsResponse{
				BusinessName: existing.BusinessName,
				GeneratedAt:  existing.GeneratedAt,
			}
			var totalRev float64
			for _, it := range existing.Items {
				resp.Projections = append(resp.Projections, ProjectionItem{
					Year:      it.Year,
					Revenue:   it.Revenue,
					Expenses:  it.Expenses,
					NetIncome: it.NetIncome,
					CashFlow:  it.CashFlow,
				})
				totalRev += it.Revenue
			}
			resp.TotalProjectedRevenue = totalRev
			// compute average growth roughly if possible
			if len(resp.Projections) >= 2 {
				var growthSum float64
				var valid int
				for i := 1; i < len(resp.Projections); i++ {
					prev := resp.Projections[i-1].Revenue
					cur := resp.Projections[i].Revenue
					if prev > 0 {
						growthSum += ((cur - prev) / prev) * 100
						valid++
					}
				}
				if valid > 0 {
					resp.AverageGrowthRate = fmt.Sprintf("%.1f%%", growthSum/float64(valid))
				} else {
					resp.AverageGrowthRate = "N/A"
				}
			} else {
				resp.AverageGrowthRate = "N/A"
			}
			// find break even
			resp.BreakEvenYear = "N/A"
			for _, p := range resp.Projections {
				if p.NetIncome > 0 {
					resp.BreakEvenYear = fmt.Sprintf("%d", p.Year)
					break
				}
			}
			return &resp, nil
		}
	}

	// Fetch business and latest financial
	var business models.Business
	if err := s.DB.
		Preload("Products").
		Preload("Legals").
		Preload("Financials", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at desc").Limit(1)
		}).
		First(&business, businessID).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch business: %w", err)
	}

	// Build profile text for AI
	bizProfile := s.buildBusinessProfileText(business)

	// Extract latest financial if present
	var finSummary string
	if len(business.Financials) > 0 {
		f := business.Financials[0]
		finSummary = fmt.Sprintf("Revenue: %.2f\nEBITDA: %.2f\nAssets: %.2f\nLiabilities: %.2f\nEquity: %.2f\nNotes: %s",
			f.Revenue, f.EBITDA, f.Assets, f.Liabilities, f.Equity, f.Notes)
	} else if business.Financial != nil {
		f := business.Financial
		finSummary = fmt.Sprintf("Revenue: %.2f\nEBITDA: %.2f\nAssets: %.2f\nLiabilities: %.2f\nEquity: %.2f\nNotes: %s",
			f.Revenue, f.EBITDA, f.Assets, f.Liabilities, f.Equity, f.Notes)
	} else {
		finSummary = "No structured financial record found for this business."
	}

	prompt := fmt.Sprintf(`
	Anda adalah seorang analis keuangan berpengalaman untuk usaha kecil menengah Indonesia.
Berdasarkan profil bisnis dan ringkasan keuangan berikut, hasilkan proyeksi finansial 5 tahun ke depan.

**Profil Bisnis:**
%s

**Ringkasan Keuangan (terbaru):**
%s

**Instruksi output:**
- Hanya outputkan JSON valid (tidak ada teks lain di luar JSON).
- Format JSON harus sesuai skema di bawah.
- Gunakan angka (number) untuk semua nilai numerik.
- Tahun proyeksi: 5 item berturut-turut (tahun sekarang +1 ... +5).
- Bahasa: Indonesia.
- Mata uang: Rupiah (IDR).

Skema yang diharapkan beserta contoh isiannya:
{
  "business_name": "Nama Bisnis",
  "projections": [
    { "year": 2026, "revenue": 1000000.0, "expenses": 700000.0, "netIncome": 300000.0, "cashFlow": 300000.0 }
  ],
  "total_projected_revenue": 5000000.0,
  "average_growth_rate": "+10.0%%",
  "break_even_year": "2027",
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ"
}
`, bizProfile, finSummary)

	parts := []*genai.Part{
		genai.NewPartFromText(prompt),
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"business_name": {Type: genai.TypeString},
				"projections": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"year":      {Type: genai.TypeNumber},
							"revenue":   {Type: genai.TypeNumber},
							"expenses":  {Type: genai.TypeNumber},
							"netIncome": {Type: genai.TypeNumber},
							"cashFlow":  {Type: genai.TypeNumber},
						},
						Required: []string{"year", "revenue", "expenses", "netIncome", "cashFlow"},
					},
				},
				"total_projected_revenue": {Type: genai.TypeNumber},
				"average_growth_rate":     {Type: genai.TypeString},
				"break_even_year":         {Type: genai.TypeString},
				"generated_at":            {Type: genai.TypeString},
			},
			Required: []string{"business_name", "projections", "generated_at"},
		},
	}

	contents := []*genai.Content{
		genai.NewContentFromParts(parts, genai.RoleUser),
	}

	result, err := s.Client.Models.GenerateContent(ctx, "gemini-2.5-flash", contents, config)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	raw := strings.TrimSpace(result.Text())
	var projections ProjectionsResponse
	if err := json.Unmarshal([]byte(raw), &projections); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w. Raw: %s", err, raw)
	}

	// Persist projections as cache
	newRec := models.BusinessProjection{
		BusinessID:   businessID,
		BusinessName: projections.BusinessName,
		GeneratedAt:  projections.GeneratedAt,
	}
	for _, p := range projections.Projections {
		newRec.Items = append(newRec.Items, models.BusinessProjectionItem{
			Year:      p.Year,
			Revenue:   p.Revenue,
			Expenses:  p.Expenses,
			NetIncome: p.NetIncome,
			CashFlow:  p.CashFlow,
		})
	}
	if err := s.DB.Create(&newRec).Error; err != nil {
		fmt.Printf("warning: failed to save projections cache: %v\n", err)
	}

	return &projections, nil
}
