package genai

import (
	"context"
	"fmt"
	"go-gin-backend/internal/models"
	"strings"

	"google.golang.org/genai"
)

// GetInvestmentAdviceWithContext provides AI investment advice with real database context
func (s *Service) GetInvestmentAdviceWithContext(userQuery string, preferences map[string]interface{}) (*InvestmentChatResponse, error) {
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
func (s *Service) getRelevantBusinesses(query string, preferences map[string]interface{}) ([]models.Business, error) {
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
func (s *Service) getMarketStatistics() (map[string]interface{}, error) {
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
		AvgEBITDA  float64
		AvgRevenue float64
		AvgAssets  float64
		AvgEquity  float64
	}
	s.DB.Model(&models.Financial{}).Select("AVG(ebitda) as avg_ebitda, AVG(revenue) as avg_revenue, AVG(assets) as avg_assets, AVG(equity) as avg_equity").Scan(&financialAvg)
	stats["financial_averages"] = financialAvg

	return stats, nil
}

// buildEnhancedContext creates comprehensive context for AI
func (s *Service) buildEnhancedContext(businesses []models.Business, stats map[string]interface{}, query string) string {
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
		AvgEBITDA  float64
		AvgRevenue float64
		AvgAssets  float64
		AvgEquity  float64
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
func (s *Service) extractKeywords(query string) []string {
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
func (s *Service) calculateBusinessValue(financial *models.Financial) float64 {
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
