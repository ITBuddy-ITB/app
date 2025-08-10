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

// GenerateBusinessSuggestions generates AI-powered business improvement suggestions
func (s *Service) GenerateBusinessSuggestions(businessID uint, isRefresh bool) (*AISuggestionsResponse, error) {
	ctx := context.Background()

	if !isRefresh {
		var existing models.BusinessAISuggestion
		if err := s.DB.Preload("Suggestions").
			Where("business_id = ?", businessID).
			Order("created_at DESC").
			First(&existing).Error; err == nil {
			// Return hasil cache
			resp := AISuggestionsResponse{
				BusinessName: existing.BusinessName,
				GeneratedAt:  existing.GeneratedAt,
			}
			for _, item := range existing.Suggestions {
				resp.Suggestions = append(resp.Suggestions, AISuggestion{
					Suggestion: item.Suggestion,
					Category:   item.Category,
					Priority:   item.Priority,
				})
			}
			return &resp, nil
		}
	}

	// Fetch business data with all relations
	var business models.Business
	if err := s.DB.
		Preload("Products").
		Preload("Legals").
		Preload("Financial").
		Preload("Financials", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at desc").Limit(1)
		}).
		First(&business, businessID).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch business: %w", err)
	}

	// Build business data summary
	businessData := s.buildBusinessDataSummary(business)

	prompt := fmt.Sprintf(`untuk melengkapi profil sebuah bisnis di aplikasi kami untuk kelancaran investasi, user perlu mengisi hal yang terkait, sesuai urutan berikut:

1 hak merek
2 surat terkait produk  
3 data terkait finansial (diinput sesuai dengan laporan pajak)

data yang dimiliki user adalah
%s

sebutkan apa yang kurang, anda boleh melakukan improvisasi sedikit dengan mengetahui data perusahaan tersebut.

Format output harus JSON dengan struktur berikut:
{
  "business_name": "Nama Bisnis",
  "suggestions": [
    {
      "suggestion": "Deskripsi lengkap apa yang perlu dilakukan dan link untuk melakukannya",
      "category": "Legal Documents atau Financial Data atau Product Information atau Profile Completion",
      "priority": "High/Medium/Low"
    }
  ],
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ"
}

Catatan: 
- Prioritaskan saran berdasarkan kelengkapan data yang sudah ada
- Berikan saran spesifik dan actionable dengan menyebutkan halaman yang harus dikunjungi
- Maksimal 5 saran yang paling penting
- Sebutkan link seperti "Kunjungi halaman Products", "Kunjungi halaman Legal Documents", "Kunjungi halaman Financial Data", "Kunjungi halaman Projections"`, businessData)

	parts := []*genai.Part{
		genai.NewPartFromText(prompt),
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"business_name": {Type: genai.TypeString},
				"suggestions": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"suggestion": {Type: genai.TypeString},
							"category":   {Type: genai.TypeString},
							"priority":   {Type: genai.TypeString},
						},
						Required: []string{"suggestion", "category", "priority"},
					},
				},
				"generated_at": {Type: genai.TypeString},
			},
			Required: []string{"business_name", "suggestions", "generated_at"},
		},
	}

	contents := []*genai.Content{
		genai.NewContentFromParts(parts, genai.RoleUser),
	}

	result, err := s.Client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		contents,
		config,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	raw := strings.TrimSpace(result.Text())
	var suggestions AISuggestionsResponse
	if err := json.Unmarshal([]byte(raw), &suggestions); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w. Raw: %s", err, raw)
	}

	// Simpan ke DB
	newRecord := models.BusinessAISuggestion{
		BusinessID:   businessID,
		BusinessName: suggestions.BusinessName,
		GeneratedAt:  suggestions.GeneratedAt,
	}
	for _, s := range suggestions.Suggestions {
		newRecord.Suggestions = append(newRecord.Suggestions, models.BusinessAISuggestionItem{
			Suggestion: s.Suggestion,
			Category:   s.Category,
			Priority:   s.Priority,
		})
	}
	if err := s.DB.Create(&newRecord).Error; err != nil {
		return nil, fmt.Errorf("failed to save AI suggestions: %w", err)
	}

	return &suggestions, nil
}

// buildBusinessDataSummary creates a comprehensive summary of business data for AI analysis
func (s *Service) buildBusinessDataSummary(business models.Business) string {
	var summary strings.Builder

	summary.WriteString(fmt.Sprintf("nama perusahaan: %s\n", business.Name))

	if business.Type != "" {
		summary.WriteString(fmt.Sprintf("kategori perusahaan: %s\n", business.Type))
	} else {
		summary.WriteString("kategori perusahaan: tidak diisi\n")
	}

	// Products summary
	if len(business.Products) > 0 {
		summary.WriteString("produk perusahaan:\n")
		for _, product := range business.Products {
			summary.WriteString(fmt.Sprintf("  - %s\n", product.Name))
		}
	} else {
		summary.WriteString("produk perusahaan: belum ada data produk\n")
	}

	// Legal documents summary
	if len(business.Legals) > 0 {
		summary.WriteString("dokumen legal yang sudah ada:\n")
		for _, legal := range business.Legals {
			summary.WriteString(fmt.Sprintf("  - %s", legal.LegalType))
			if legal.Notes != "" {
				summary.WriteString(fmt.Sprintf(" (%s)", legal.Notes))
			}
			summary.WriteString("\n")
		}
	} else {
		summary.WriteString("dokumen legal: belum ada dokumen legal\n")
	}

	// Financial summary
	hasFinancial := false
	if business.Financial != nil {
		summary.WriteString("data finansial perusahaan:\n")
		summary.WriteString(fmt.Sprintf("  - Revenue: %.2f\n", business.Financial.Revenue))
		summary.WriteString(fmt.Sprintf("  - EBITDA: %.2f\n", business.Financial.EBITDA))
		summary.WriteString(fmt.Sprintf("  - Assets: %.2f\n", business.Financial.Assets))
		summary.WriteString(fmt.Sprintf("  - Liabilities: %.2f\n", business.Financial.Liabilities))
		summary.WriteString(fmt.Sprintf("  - Equity: %.2f\n", business.Financial.Equity))
		if business.Financial.Notes != "" {
			summary.WriteString(fmt.Sprintf("  - Notes: %s\n", business.Financial.Notes))
		}
		hasFinancial = true
	}
	if len(business.Financials) > 0 {
		latest := business.Financials[0]
		if !hasFinancial {
			summary.WriteString("data finansial perusahaan:\n")
		}
		summary.WriteString(fmt.Sprintf("  - Revenue terbaru: %.2f\n", latest.Revenue))
		summary.WriteString(fmt.Sprintf("  - EBITDA terbaru: %.2f\n", latest.EBITDA))
		hasFinancial = true
	}
	if !hasFinancial {
		summary.WriteString("data finansial perusahaan: belum ada data finansial\n")
	}

	return summary.String()
}
