package models

// LegalComparison represents the complete legal analysis comparison
type LegalComparison struct {
	Required []BusinessLegalRequirement `json:"required"`
	Products []ProductLegalComparison   `json:"products"`
}

// BusinessLegalRequirement represents a required legal document for the business
type BusinessLegalRequirement struct {
	Type     string                    `json:"type"`
	HasLegal bool                     `json:"has_legal"`
	Notes    string                   `json:"notes"`
	Steps    []LegalAcquisitionStep   `json:"steps,omitempty"`
}

// ProductLegalComparison represents legal requirements for a specific product
type ProductLegalComparison struct {
	ProductName string                      `json:"product_name"`
	Required    []ProductLegalRequirement   `json:"required"`
}

// ProductLegalRequirement represents a required legal document for a product
type ProductLegalRequirement struct {
	Type     string                    `json:"type"`
	HasLegal bool                     `json:"has_legal"`
	Notes    string                   `json:"notes"`
	Steps    []LegalAcquisitionStep   `json:"steps,omitempty"`
}

// LegalAcquisitionStep represents a step to obtain a legal document
type LegalAcquisitionStep struct {
	StepNumber   int    `json:"step_number"`
	Description  string `json:"description"`
	RedirectURL  string `json:"redirect_url"`
}