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
