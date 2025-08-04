package services

import (
	"context"
	"encoding/json"
	"fmt"
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

func (s *GenAIService) AnalyzeBusinessLegals(file *multipart.FileHeader) (*BusinessLegalAnalysis, error) {
	ctx := context.Background()

	f, err := file.Open()
	if (err != nil) {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer f.Close()

	content, err := io.ReadAll(f)
	if (err != nil) {
		return nil, fmt.Errorf("failed to read file content: %w", err)
	}

	parts := []*genai.Part{
		{
			InlineData: &genai.Blob{
				MIMEType: "application/pdf",
				Data:     content,
			},
		},
		genai.NewPartFromText(`Analyze this business profile and provide:
			1. List all legal documents this business should have
			2. For each legal document, provide step-by-step guide to obtain it
			3. For each product mentioned, list required legal documents
			4. For each product legal document, provide step-by-step guide
			
			Return in this JSON format:
			{
				"business_legals": [{
					"legal_type": string,
					"notes": string,
					"steps": [{
						"step_number": number,
						"description": string,
						"redirect_url": string
					}]
				}],
				"product_legals": [{
					"product_name": string,
					"legal_type": string,
					"notes": string,
					"steps": [{
						"step_number": number,
						"description": string,
						"redirect_url": string
					}]
				}]
			}`),
	}

	config := &genai.GenerateContentConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"business_legals": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"legal_type": {Type: genai.TypeString},
							"notes":      {Type: genai.TypeString},
							"steps": {
								Type: genai.TypeArray,
								Items: &genai.Schema{
									Type: genai.TypeObject,
									Properties: map[string]*genai.Schema{
										"step_number":  {Type: genai.TypeNumber},
										"description": {Type: genai.TypeString},
										"redirect_url": {Type: genai.TypeString},
									},
								},
							},
						},
					},
				},
				"product_legals": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"product_name": {Type: genai.TypeString},
							"legal_type":   {Type: genai.TypeString},
							"notes":        {Type: genai.TypeString},
							"steps": {
								Type: genai.TypeArray,
								Items: &genai.Schema{
									Type: genai.TypeObject,
									Properties: map[string]*genai.Schema{
										"step_number":  {Type: genai.TypeNumber},
										"description": {Type: genai.TypeString},
										"redirect_url": {Type: genai.TypeString},
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
	if (err != nil) {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	var analysis BusinessLegalAnalysis
	if err := json.Unmarshal([]byte(result.Text()), &analysis); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w", err)
	}

	return &analysis, nil
}
