package services

import (
	"context"
	"fmt"
	"log"

	"google.golang.org/genai"
	"gorm.io/gorm"
)

type GenAIService struct {
	DB *gorm.DB
}

func NewGenAIService(db *gorm.DB) *GenAIService {
	return &GenAIService{DB: db}
}

func (s *GenAIService) GetAIResponse(input string) string {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

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

	result, err := client.Models.GenerateContent(
		ctx,
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
