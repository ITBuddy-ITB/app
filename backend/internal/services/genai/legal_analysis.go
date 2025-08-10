package genai

import (
	"context"
	"encoding/json"
	"fmt"
	"go-gin-backend/internal/models"
	"strings"

	"google.golang.org/genai"
)

// AnalyzeBusinessLegals analyzes business legal compliance and provides recommendations
func (s *Service) AnalyzeBusinessLegals(businessID uint) (*models.LegalComparison, error) {
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

// buildBusinessProfileText builds a comprehensive text representation of business data for AI analysis
func (s *Service) buildBusinessProfileText(business models.Business) string {
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
