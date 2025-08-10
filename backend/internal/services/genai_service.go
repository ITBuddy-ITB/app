package services

import (
	"go-gin-backend/internal/models"
	"go-gin-backend/internal/services/genai"
	"mime/multipart"

	"gorm.io/gorm"
)

// GenAIService wraps the genai package for backward compatibility
type GenAIService struct {
	*genai.Service
}

// NewGenAIService creates a new GenAI service instance
func NewGenAIService(db *gorm.DB) *GenAIService {
	return &GenAIService{
		Service: genai.NewService(db),
	}
}

// Wrapper methods to maintain existing API compatibility

// GetAIResponse provides a simple AI chat response
func (s *GenAIService) GetAIResponse(input string) string {
	return s.Service.GetAIResponse(input)
}

// InferProductsFromFile extracts product names from an uploaded file using AI
func (s *GenAIService) InferProductsFromFile(file *multipart.FileHeader) ([]string, error) {
	return s.Service.InferProductsFromFile(file)
}

// AnalyzeBusinessLegals analyzes business legal compliance and provides recommendations
func (s *GenAIService) AnalyzeBusinessLegals(businessID uint) (*models.LegalComparison, error) {
	return s.Service.AnalyzeBusinessLegals(businessID)
}

// GenerateBusinessSuggestions generates AI-powered business improvement suggestions
func (s *GenAIService) GenerateBusinessSuggestions(businessID uint, isRefresh bool) (*genai.AISuggestionsResponse, error) {
	return s.Service.GenerateBusinessSuggestions(businessID, isRefresh)
}

// GetInvestmentAdviceWithContext provides AI investment advice with real database context
func (s *GenAIService) GetInvestmentAdviceWithContext(userQuery string, preferences map[string]interface{}) (*genai.InvestmentChatResponse, error) {
	return s.Service.GetInvestmentAdviceWithContext(userQuery, preferences)
}

// GenerateProjections generates financial projections for a business
func (s *GenAIService) GenerateProjections(businessID uint, isRefresh bool) (*genai.ProjectionsResponse, error) {
	return s.Service.GenerateProjections(businessID, isRefresh)
}
