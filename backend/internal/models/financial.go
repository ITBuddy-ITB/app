package models

import (
	"gorm.io/gorm"
)

// Revenue-based EBITDA multiplier constants
const (
	// Revenue thresholds in IDR
	REVENUE_TIER_1 = 1_000_000_000  // 1B IDR
	REVENUE_TIER_2 = 5_000_000_000  // 5B IDR
	REVENUE_TIER_3 = 10_000_000_000 // 10B IDR
	REVENUE_TIER_4 = 50_000_000_000 // 50B IDR

	// EBITDA multipliers
	EBITDA_MULTIPLIER_MIN  = 1.0 // For revenue < 1B IDR
	EBITDA_MULTIPLIER_LOW  = 2.0 // For revenue 1B-5B IDR
	EBITDA_MULTIPLIER_MID  = 3.0 // For revenue 5B-10B IDR
	EBITDA_MULTIPLIER_HIGH = 4.0 // For revenue 10B-50B IDR
	EBITDA_MULTIPLIER_MAX  = 5.0 // For revenue > 50B IDR
)

type Financial struct {
	gorm.Model
	BusinessID uint `json:"business_id"`

	Revenue     float64 `json:"revenue,omitempty"`
	EBITDA      float64 `json:"ebitda,omitempty"`
	Assets      float64 `json:"assets,omitempty"`
	Liabilities float64 `json:"liabilities,omitempty"`
	Equity      float64 `json:"equity,omitempty"`

	ReportFileURL string `json:"report_file_url,omitempty"` // raw financial file (pdf/txt)
	Notes         string `json:"notes,omitempty"`
}

// GetEBITDAMultiplier returns the EBITDA multiplier based on revenue
func (f *Financial) GetEBITDAMultiplier() float64 {
	if f.Revenue < REVENUE_TIER_1 {
		return EBITDA_MULTIPLIER_MIN
	} else if f.Revenue < REVENUE_TIER_2 {
		return EBITDA_MULTIPLIER_LOW
	} else if f.Revenue < REVENUE_TIER_3 {
		return EBITDA_MULTIPLIER_MID
	} else if f.Revenue < REVENUE_TIER_4 {
		return EBITDA_MULTIPLIER_HIGH
	}
	return EBITDA_MULTIPLIER_MAX
}

// CalculateMarketCap returns the market cap (EBITDA * multiplier)
func (f *Financial) CalculateMarketCap() float64 {
	if f.EBITDA <= 0 {
		return 0
	}
	return f.EBITDA * f.GetEBITDAMultiplier()
}

type FinancialAdditionalInfo struct {
	gorm.Model
	FinancialID uint   `gorm:"unique" json:"financial_id"`
	Name        string `json:"name"`
	Value       string `json:"value"`
}
