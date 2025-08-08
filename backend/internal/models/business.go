package models

import (
	"time"

	"gorm.io/gorm"
)

type Business struct {
	gorm.Model
	UserID uint  `json:"user_id"`
	User   *User `json:"user,omitempty"`

	Name        string     `gorm:"not null" json:"name"`
	Type        string     `json:"type,omitempty"`
	Description string     `json:"description,omitempty"`
	Industry    string     `json:"industry,omitempty"`
	FoundedAt   *time.Time `json:"founded_at,omitempty"`

	// Relations
	Legals     []Legal     `gorm:"foreignKey:BusinessID" json:"legals,omitempty"`
	Products   []Product   `gorm:"foreignKey:BusinessID" json:"products,omitempty"`
	Financials []Financial `gorm:"foreignKey:BusinessID" json:"financials,omitempty"`
	Financial  *Financial  `gorm:"foreignKey:BusinessID" json:"financial,omitempty"` // Latest financial record for compatibility
}

// GetMarketCap returns the calculated market cap based on financial data
func (b *Business) GetMarketCap() float64 {
	if b.Financial == nil {
		return 0
	}
	return b.Financial.CalculateMarketCap()
}

// GetEBITDAMultiplier returns the EBITDA multiplier for this business
func (b *Business) GetEBITDAMultiplier() float64 {
	if b.Financial == nil {
		return 0
	}
	return b.Financial.GetEBITDAMultiplier()
}

// BusinessCompleteness represents the completeness status of a business profile
type BusinessCompleteness struct {
	BasicInfo         bool    `json:"basic_info"`
	HasProducts       bool    `json:"has_products"`
	HasLegalDocs      bool    `json:"has_legal_docs"`
	HasProductLegals  bool    `json:"has_product_legals"`
	HasFinancialData  bool    `json:"has_financial_data"`
	OverallProgress   float64 `json:"overall_progress"`
	CompletedSections int     `json:"completed_sections"`
	TotalSections     int     `json:"total_sections"`
}

type BusinessAdditionalInfo struct {
	gorm.Model
	BusinessID uint   `gorm:"unique" json:"business_id"`
	Name       string `json:"name"`
	Value      string `json:"value"`
}
