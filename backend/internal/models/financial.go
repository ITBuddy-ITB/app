package models

import (
	"gorm.io/gorm"
)

type Financial struct {
	gorm.Model
	BusinessID uint `gorm:"unique" json:"business_id"`

	Revenue     float64 `json:"revenue,omitempty"`
	EBITDA      float64 `json:"ebitda,omitempty"`
	Profit      float64 `json:"profit,omitempty"`
	Assets      float64 `json:"assets,omitempty"`
	Liabilities float64 `json:"liabilities,omitempty"`
	Equity      float64 `json:"equity,omitempty"`

	ReportFileURL string `json:"report_file_url,omitempty"` // raw financial file (pdf/txt)
	Notes         string `json:"notes,omitempty"`
}

type FinancialAdditionalInfo struct {
	gorm.Model
	FinancialID uint   `gorm:"unique" json:"financial_id"`
	Name        string `json:"name"`
	Value       string `json:"value"`
}
