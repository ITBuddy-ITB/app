package genai

import (
	"context"
	"log"

	"google.golang.org/genai"
	"gorm.io/gorm"
)

// Service provides AI-powered business analysis and suggestions
type Service struct {
	DB     *gorm.DB
	Client *genai.Client
	Ctx    context.Context
}

// NewService creates a new GenAI service instance
func NewService(db *gorm.DB) *Service {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	return &Service{DB: db, Client: client, Ctx: ctx}
}

// GetAIResponse provides a simple AI chat response
func (s *Service) GetAIResponse(input string) string {
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
		return "Maaf, terjadi kesalahan saat memproses permintaan Anda."
	}

	return result.Text()
}
