package genai

// BusinessLegalAnalysis represents the structure for legal document analysis
type BusinessLegalAnalysis struct {
	BusinessName     string   `json:"business_name"`
	LegalDocuments   []string `json:"legal_documents"`
	MissingDocuments []string `json:"missing_documents"`
	Recommendations  []string `json:"recommendations"`
	ComplianceScore  string   `json:"compliance_score"`
	GeneratedAt      string   `json:"generated_at"`
}

// InvestmentChatRequest represents the investment chat request structure
type InvestmentChatRequest struct {
	Query       string                 `json:"query"`
	Preferences map[string]interface{} `json:"preferences,omitempty"`
}

// InvestmentChatResponse represents the investment advice response
type InvestmentChatResponse struct {
	Response    string `json:"response"`
	GeneratedAt string `json:"generated_at"`
}

// AISuggestion represents a single AI-generated suggestion
type AISuggestion struct {
	Suggestion string `json:"suggestion"`
	Category   string `json:"category"`
	Priority   string `json:"priority"`
}

// AISuggestionsResponse represents the response for business suggestions
type AISuggestionsResponse struct {
	BusinessName string         `json:"business_name"`
	Suggestions  []AISuggestion `json:"suggestions"`
	GeneratedAt  string         `json:"generated_at"`
}
