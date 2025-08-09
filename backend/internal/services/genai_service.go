package services

import (
	"context"
	"encoding/json"
	"fmt"
	"go-gin-backend/internal/models"
	"io"
	"log"
	"mime/multipart"
	"strings"

	"google.golang.org/genai"
	"gorm.io/gorm"
)

type GenAIService struct {
	DB     *gorm.DB
	Client *genai.Client
	Ctx    context.Context
}

func NewGenAIService(db *gorm.DB) *GenAIService {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	return &GenAIService{DB: db, Client: client, Ctx: ctx}
}

func (s *GenAIService) GetAIResponse(input string) string {
	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeArray,
			Items: &genai.Schema{
				Type: genai.TypeObject,
				Properties: map[string]*genai.Schema{
					"header":   {Type: genai.TypeString},
					"response": {Type: genai.TypeString},
				},
				PropertyOrdering: []string{"header", "response"},
			},
		},
	}

	result, err := s.Client.Models.GenerateContent(
		s.Ctx,
		"gemini-2.5-flash",
		genai.Text(input),
		config,
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(result.Text())
	return result.Text()
}

func (s *GenAIService) InferProductsFromFile(file *multipart.FileHeader) ([]string, error) {
	ctx := context.Background()

	f, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer f.Close()

	content, err := io.ReadAll(f)
	if err != nil {
		return nil, fmt.Errorf("failed to read file content: %w", err)
	}

	parts := []*genai.Part{
		{
			InlineData: &genai.Blob{
				MIMEType: "application/pdf",
				Data:     content,
			},
		},
		genai.NewPartFromText("Extract product names from this document. Only the product names, separated by comma."),
	}

	// Config Response Schema
	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeString,
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

	rawNames := strings.Split(result.Text(), ",")
	var productNames []string
	for _, name := range rawNames {
		clean := strings.TrimSpace(strings.Trim(name, `\"`))
		if clean != "" {
			productNames = append(productNames, clean)
		}
	}

	return productNames, nil
}

type BusinessLegalAnalysis struct {
	BusinessLegals []struct {
		LegalType string `json:"legal_type"`
		Notes     string `json:"notes"`
		Steps     []struct {
			StepNumber  int    `json:"step_number"`
			Description string `json:"description"`
			RedirectURL string `json:"redirect_url"`
		} `json:"steps"`
	} `json:"business_legals"`
	ProductLegals []struct {
		ProductName string `json:"product_name"`
		LegalType   string `json:"legal_type"`
		Notes       string `json:"notes"`
		Steps       []struct {
			StepNumber  int    `json:"step_number"`
			Description string `json:"description"`
			RedirectURL string `json:"redirect_url"`
		} `json:"steps"`
	} `json:"product_legals"`
}

func (s *GenAIService) AnalyzeBusinessLegals(businessID uint) (*models.LegalComparison, error) {
	ctx := context.Background()

	// Fetch business data with all relations
	var business models.Business
	if err := s.DB.Preload("Products").Preload("Legals").Preload("Products.ProductLegals").
		First(&business, businessID).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch business: %w", err)
	}

	// Build business profile text for AI analysis
	businessProfile := s.buildBusinessProfileText(business)

	prompt := fmt.Sprintf(`Anda adalah seorang ahli hukum bisnis yang mengkhususkan diri dalam regulasi dan kepatuhan di Indonesia. Tugas Anda adalah melakukan analisis mendalam terhadap profil bisnis yang diberikan, mengidentifikasi dokumen hukum yang diperlukan, mengevaluasi status kepemilikannya, dan memberikan panduan yang jelas untuk mengurus dokumen yang belum ada.

**Profil Bisnis:**
%s

**Instruksi Analisis:**

1.  **Analisis Dokumen Wajib Perusahaan:**
    * Berdasarkan jenis, industri, dan lokasi (Indonesia) bisnis ini, tentukan dokumen hukum wajib apa saja yang seharusnya dimiliki perusahaan.
    * Periksa apakah bisnis ini sudah memiliki masing-masing dokumen tersebut.
    * Untuk setiap dokumen yang belum dimiliki, berikan panduan langkah demi langkah yang praktis untuk mendapatkannya. Setiap langkah harus dimulai dari nomor 1 dan berurutan.

2.  **Analisis Dokumen Wajib Produk:**
    * Untuk setiap produk yang disebutkan dalam profil bisnis, tentukan dokumen hukum apa saja yang diwajibkan oleh peraturan di Indonesia.
    * Periksa apakah setiap produk telah memiliki dokumen yang disyaratkan.
    * Untuk setiap dokumen produk yang belum ada, berikan panduan langkah demi langkah yang jelas dan berurutan (dimulai dari nomor 1) untuk mengurusnya.

**Format Output:**

Sajikan hasil analisis dalam format JSON berikut.
{
  "required": [
    {
      "type": "Nama Dokumen Hukum",
      "has_legal": boolean,
      "notes": "Deskripsi atau catatan status",
      "steps": [
        {
          "step_number": 1,
          "description": "Deskripsi langkah",
          "redirect_url": "/legal/guide/example"
        }
      ]
    }
  ],
  "products": [
    {
      "product_name": "Nama Produk",
      "required": [
        {
          "type": "Nama Dokumen Hukum",
          "has_legal": boolean,
          "notes": "Deskripsi atau catatan status",
          "steps": [
            {
              "step_number": 1,
              "description": "Deskripsi langkah",
              "redirect_url": "/legal/guide/example"
            }
          ]
        }
      ]
    }
  ]
}

Panduan Penting:
- Gunakan nama dokumen dan persyaratan hukum yang sesuai dengan regulasi di Indonesia.
- Hanya sertakan array "steps" jika has_legal bernilai false.
- Berikan panduan langkah yang praktis, mudah dipahami, dan relevan dengan proses di Indonesia.
- URL pada redirect_url harus terlihat realistis, seperti URL internal yang mengarah ke panduan lebih detail (contoh: /legal/panduan/akta-pendirian).
- Pastikan langkah-langkah dalam array "steps" selalu dimulai dari step_number: 1 untuk setiap dokumen yang hilang jangan biarkan kosong.`, businessProfile)

	parts := []*genai.Part{
		genai.NewPartFromText(prompt),
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"required": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"type":      {Type: genai.TypeString},
							"has_legal": {Type: genai.TypeBoolean},
							"notes":     {Type: genai.TypeString},
							"steps": {
								Type: genai.TypeArray,
								Items: &genai.Schema{
									Type: genai.TypeObject,
									Properties: map[string]*genai.Schema{
										"step_number":  {Type: genai.TypeNumber},
										"description":  {Type: genai.TypeString},
										"redirect_url": {Type: genai.TypeString},
									},
								},
							},
						},
					},
				},
				"products": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"product_name": {Type: genai.TypeString},
							"required": {
								Type: genai.TypeArray,
								Items: &genai.Schema{
									Type: genai.TypeObject,
									Properties: map[string]*genai.Schema{
										"type":      {Type: genai.TypeString},
										"has_legal": {Type: genai.TypeBoolean},
										"notes":     {Type: genai.TypeString},
										"steps": {
											Type: genai.TypeArray,
											Items: &genai.Schema{
												Type: genai.TypeObject,
												Properties: map[string]*genai.Schema{
													"step_number":  {Type: genai.TypeNumber},
													"description":  {Type: genai.TypeString},
													"redirect_url": {Type: genai.TypeString},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
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

	var comparison models.LegalComparison
	if err := json.Unmarshal([]byte(result.Text()), &comparison); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return &comparison, nil
}

// Helper method to build business profile text
func (s *GenAIService) buildBusinessProfileText(business models.Business) string {
	var profile strings.Builder

	profile.WriteString(fmt.Sprintf("Business Name: %s\n", business.Name))
	profile.WriteString(fmt.Sprintf("Business Type: %s\n", business.Type))
	profile.WriteString(fmt.Sprintf("Industry: %s\n", business.Industry))
	profile.WriteString(fmt.Sprintf("Description: %s\n", business.Description))

	if business.FoundedAt != nil {
		profile.WriteString(fmt.Sprintf("Founded: %s\n", business.FoundedAt.Format("2006-01-02")))
	}

	profile.WriteString("\nCurrent Legal Documents:\n")
	if len(business.Legals) == 0 {
		profile.WriteString("- No legal documents currently registered\n")
	} else {
		for _, legal := range business.Legals {
			profile.WriteString(fmt.Sprintf("- %s", legal.LegalType))
			if legal.IssuedBy != "" {
				profile.WriteString(fmt.Sprintf(" (issued by %s)", legal.IssuedBy))
			}
			if legal.ValidUntil != nil {
				profile.WriteString(fmt.Sprintf(" [valid until %s]", legal.ValidUntil.Format("2006-01-02")))
			}
			profile.WriteString("\n")
		}
	}

	profile.WriteString("\nProducts:\n")
	if len(business.Products) == 0 {
		profile.WriteString("- No products registered\n")
	} else {
		for _, product := range business.Products {
			profile.WriteString(fmt.Sprintf("- Product: %s\n", product.Name))

			if len(product.ProductLegals) == 0 {
				profile.WriteString("  Legal documents: None\n")
			} else {
				profile.WriteString("  Legal documents:\n")
				for _, prodLegal := range product.ProductLegals {
					profile.WriteString(fmt.Sprintf("    - %s", prodLegal.LegalType))
					if prodLegal.IssuedBy != "" {
						profile.WriteString(fmt.Sprintf(" (issued by %s)", prodLegal.IssuedBy))
					}
					if prodLegal.ValidUntil != nil {
						profile.WriteString(fmt.Sprintf(" [valid until %s]", prodLegal.ValidUntil.Format("2006-01-02")))
					}
					profile.WriteString("\n")
				}
			}
		}
	}

	return profile.String()
}

// Investment Chat with Context
type InvestmentChatRequest struct {
	Message     string                 `json:"message"`
	Preferences map[string]interface{} `json:"preferences,omitempty"`
}

type InvestmentChatResponse struct {
	Response string `json:"response"`
}

// AI Suggestions
type AISuggestion struct {
	Suggestion string `json:"suggestion"`
	Category   string `json:"category"`
	Priority   string `json:"priority"`
}

type AISuggestionsResponse struct {
	BusinessName string         `json:"business_name"`
	Suggestions  []AISuggestion `json:"suggestions"`
	GeneratedAt  string         `json:"generated_at"`
}

func (s *GenAIService) GenerateBusinessSuggestions(businessID uint, isRefresh bool) (*AISuggestionsResponse, error) {
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
	if err := s.DB.Preload("Products").Preload("Legals").Preload("Products.ProductLegals").
		First(&business, businessID).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch business: %w", err)
	}

	// Build business profile text for AI analysis
	businessProfile := s.buildBusinessProfileText(business)

	prompt := fmt.Sprintf(`Anda adalah seorang konsultan bisnis berpengalaman di Indonesia. 
Analisis profil bisnis berikut dan berikan 6-8 saran yang actionable.

**Profil Bisnis:**
%s

**Instruksi Output:**
- Format **hanya** dalam JSON yang valid (tanpa teks lain di luar JSON).
- Gunakan struktur berikut:

{
  "business_name": "Nama Bisnis",
  "suggestions": [
    {
      "suggestion": "Deskripsi saran detail dan actionable",
      "category": "Marketing & Branding",
      "priority": "High"
    }
  ],
  "generated_at": "YYYY-MM-DDTHH:MM:SSZ"
}

**Aturan:**
- Kategori harus salah satu dari: "Marketing & Branding", "Product Development", "Operations", "Partnership", "Digital Transformation", "Customer Experience".
- Priority: "High", "Medium", "Low".
- Bahasa: Indonesia yang mudah dipahami.
- Semua field harus diisi.
- Buat saran yang singkat, spesifik, terukur, dan relevan dengan bisnis.
- Tidak boleh ada teks di luar JSON.
`, businessProfile)

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

// GetInvestmentAdviceWithContext provides AI investment advice with real database context
func (s *GenAIService) GetInvestmentAdviceWithContext(userQuery string, preferences map[string]interface{}) (*InvestmentChatResponse, error) {
	ctx := context.Background()

	// Get relevant businesses based on query keywords and preferences
	relevantBusinesses, err := s.getRelevantBusinesses(userQuery, preferences)
	if err != nil {
		return nil, fmt.Errorf("failed to get relevant businesses: %w", err)
	}

	// Get market statistics
	marketStats, err := s.getMarketStatistics()
	if err != nil {
		return nil, fmt.Errorf("failed to get market statistics: %w", err)
	}

	// Build enhanced context with real data
	contextPrompt := s.buildEnhancedContext(relevantBusinesses, marketStats, userQuery)

	parts := []*genai.Part{
		genai.NewPartFromText(contextPrompt),
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "text/plain",
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
		return nil, fmt.Errorf("failed to generate AI response: %w", err)
	}

	return &InvestmentChatResponse{
		Response: result.Text(),
	}, nil
}

// getRelevantBusinesses retrieves businesses based on query and preferences
func (s *GenAIService) getRelevantBusinesses(query string, preferences map[string]interface{}) ([]models.Business, error) {
	var businesses []models.Business

	// Build dynamic query based on user input
	dbQuery := s.DB.Preload("Financial").Preload("Legals").Preload("Products")

	// Extract keywords from query for filtering
	keywords := s.extractKeywords(query)

	if len(keywords) > 0 {
		var conditions []string
		var args []interface{}
		
		for _, keyword := range keywords {
			conditions = append(conditions, "name ILIKE ? OR description ILIKE ? OR industry ILIKE ? OR type ILIKE ?")
			args = append(args, "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
		}
		
		dbQuery = dbQuery.Where(strings.Join(conditions, " OR "), args...)
	}

	// Apply user preferences
	if industry, ok := preferences["industry"].(string); ok && industry != "" {
		dbQuery = dbQuery.Where("industry = ?", industry)
	}

	// Only get businesses with financial data for better investment advice
	dbQuery = dbQuery.Joins("LEFT JOIN financials ON businesses.id = financials.business_id")
	
	// Order by businesses with financial data first, then by created date
	dbQuery = dbQuery.Order("CASE WHEN financials.id IS NOT NULL THEN 0 ELSE 1 END, businesses.created_at DESC")

	// Limit results for performance and context window
	if err := dbQuery.Limit(8).Find(&businesses).Error; err != nil {
		return nil, err
	}

	return businesses, nil
}

// getMarketStatistics gets current market overview
func (s *GenAIService) getMarketStatistics() (map[string]interface{}, error) {
	var stats map[string]interface{} = make(map[string]interface{})

	// Total businesses count
	var totalBusinesses int64
	s.DB.Model(&models.Business{}).Count(&totalBusinesses)
	stats["total_businesses"] = totalBusinesses

	// Businesses with financial data
	var withFinancial int64
	s.DB.Model(&models.Business{}).Joins("JOIN financials ON businesses.id = financials.business_id").Count(&withFinancial)
	stats["businesses_with_financial"] = withFinancial

	// Industry distribution
	var industries []struct {
		Industry string
		Count    int64
	}
	s.DB.Model(&models.Business{}).Select("industry, COUNT(*) as count").Where("industry IS NOT NULL AND industry != ''").Group("industry").Scan(&industries)
	stats["industry_distribution"] = industries

	// Financial averages (only for businesses with financial data)
	var financialAvg struct {
		AvgEBITDA   float64
		AvgRevenue  float64
		AvgAssets   float64
		AvgEquity   float64
	}
	s.DB.Model(&models.Financial{}).Select("AVG(ebitda) as avg_ebitda, AVG(revenue) as avg_revenue, AVG(assets) as avg_assets, AVG(equity) as avg_equity").Scan(&financialAvg)
	stats["financial_averages"] = financialAvg

	return stats, nil
}

// buildEnhancedContext creates comprehensive context for AI
func (s *GenAIService) buildEnhancedContext(businesses []models.Business, stats map[string]interface{}, query string) string {
	var context strings.Builder

	context.WriteString(`Anda adalah seorang penasihat investasi berpengalaman yang membantu investor menemukan peluang investasi bisnis terbaik di Indonesia. Gunakan data pasar real-time di bawah ini untuk memberikan advice yang akurat dan spesifik.

OVERVIEW PASAR INVESTASI SAAT INI:
`)

	// Market overview
	context.WriteString(fmt.Sprintf("- Total bisnis di platform: %v\n", stats["total_businesses"]))
	context.WriteString(fmt.Sprintf("- Bisnis dengan data finansial lengkap: %v\n", stats["businesses_with_financial"]))

	if industries, ok := stats["industry_distribution"].([]struct {
		Industry string
		Count    int64
	}); ok {
		context.WriteString("\n- Distribusi industri:\n")
		for _, ind := range industries {
			context.WriteString(fmt.Sprintf("  • %s: %d bisnis\n", ind.Industry, ind.Count))
		}
	}

	// Financial market data
	if financialAvg, ok := stats["financial_averages"].(struct {
		AvgEBITDA   float64
		AvgRevenue  float64
		AvgAssets   float64
		AvgEquity   float64
	}); ok {
		context.WriteString("\nRATA-RATA FINANSIAL PASAR:\n")
		context.WriteString(fmt.Sprintf("- Rata-rata EBITDA: Rp %.0f\n", financialAvg.AvgEBITDA))
		context.WriteString(fmt.Sprintf("- Rata-rata Revenue: Rp %.0f\n", financialAvg.AvgRevenue))
		context.WriteString(fmt.Sprintf("- Rata-rata Assets: Rp %.0f\n", financialAvg.AvgAssets))
		context.WriteString(fmt.Sprintf("- Rata-rata Equity: Rp %.0f\n", financialAvg.AvgEquity))
	}

	// Relevant businesses
	context.WriteString("\nPELUANG INVESTASI YANG RELEVAN:\n")
	if len(businesses) == 0 {
		context.WriteString("- Tidak ada bisnis yang sesuai dengan kriteria pencarian saat ini.\n")
	} else {
		for i, business := range businesses {
			if i >= 6 { // Limit to top 6 for context length
				break
			}

			context.WriteString(fmt.Sprintf("\n%d. %s (%s)\n", i+1, business.Name, business.Industry))
			context.WriteString(fmt.Sprintf("   - Tipe: %s\n", business.Type))
			context.WriteString(fmt.Sprintf("   - Deskripsi: %s\n", business.Description))

			if business.Financial != nil {
				context.WriteString(fmt.Sprintf("   - Revenue: Rp %.0f\n", business.Financial.Revenue))
				context.WriteString(fmt.Sprintf("   - EBITDA: Rp %.0f\n", business.Financial.EBITDA))
				context.WriteString(fmt.Sprintf("   - Assets: Rp %.0f\n", business.Financial.Assets))
				context.WriteString(fmt.Sprintf("   - Equity: Rp %.0f\n", business.Financial.Equity))

				// Calculate business value using same logic as frontend
				businessValue := s.calculateBusinessValue(business.Financial)
				context.WriteString(fmt.Sprintf("   - Nilai Bisnis Terhitung: Rp %.0f\n", businessValue))

				// Calculate financial ratios
				if business.Financial.Assets > 0 {
					debtToAsset := (business.Financial.Liabilities / business.Financial.Assets) * 100
					context.WriteString(fmt.Sprintf("   - Debt-to-Asset Ratio: %.1f%%\n", debtToAsset))
				}
			} else {
				context.WriteString("   - Data finansial: Belum tersedia\n")
			}

			context.WriteString(fmt.Sprintf("   - Dokumen legal: %d\n", len(business.Legals)))
			context.WriteString(fmt.Sprintf("   - Produk: %d\n", len(business.Products)))
		}
	}

	context.WriteString(fmt.Sprintf("\nPERTANYAAN INVESTOR: %s\n", query))

	context.WriteString(`
INSTRUKSI RESPONSE:
1. Berikan advice yang spesifik berdasarkan data real di atas
2. Jika ada bisnis yang cocok, sebutkan nama dan alasan spesifiknya
3. Bandingkan dengan rata-rata pasar untuk memberikan konteks
4. Jelaskan risiko dan potensi return berdasarkan data finansial actual
5. Berikan rekomendasi yang actionable dan mudah dipahami
6. Gunakan bahasa Indonesia yang professional namun mudah dipahami
7. Jika tidak ada data yang cukup, jelaskan apa yang perlu dilengkapi

Berikan response dalam 2-3 paragraf yang informatif dan helpful.
`)

	return context.String()
}

// extractKeywords extracts relevant keywords from user query
func (s *GenAIService) extractKeywords(query string) []string {
	words := strings.Fields(strings.ToLower(query))
	keywords := []string{}

	// Filter out common words
	stopWords := map[string]bool{
		"saya": true, "ingin": true, "mau": true, "invest": true, "investasi": true,
		"bisnis": true, "usaha": true, "perusahaan": true, "di": true, "pada": true,
		"dengan": true, "yang": true, "dan": true, "atau": true, "untuk": true,
		"adalah": true, "ini": true, "itu": true, "ada": true, "tidak": true,
		"i": true, "want": true, "to": true, "in": true, "a": true, "an": true,
		"the": true, "and": true, "or": true, "business": true, "company": true,
	}

	for _, word := range words {
		if len(word) > 2 && !stopWords[word] {
			keywords = append(keywords, word)
		}
	}

	return keywords
}

// calculateBusinessValue calculates business value using same logic as frontend
func (s *GenAIService) calculateBusinessValue(financial *models.Financial) float64 {
	revenue := financial.Revenue
	ebitda := financial.EBITDA

	var multiplier float64
	if revenue < 1000000000 { // < 1B
		multiplier = 1.0
	} else if revenue < 5000000000 { // < 5B
		multiplier = 2.0
	} else if revenue < 10000000000 { // < 10B
		multiplier = 3.0
	} else if revenue < 50000000000 { // < 50B
		multiplier = 4.0
	} else {
		multiplier = 5.0
	}

	return ebitda * multiplier
}
