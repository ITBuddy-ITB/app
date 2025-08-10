package models

import "gorm.io/gorm"

// HistoricalProjection represents historical financial projections for a business
type HistoricalProjection struct {
	gorm.Model
	BusinessID uint    `json:"business_id" gorm:"not null;index"`
	Year       int     `json:"year" gorm:"not null"`
	Revenue    float64 `json:"revenue" gorm:"default:0"`
	Expenses   float64 `json:"expenses" gorm:"default:0"`
	NetIncome  float64 `json:"net_income" gorm:"default:0"`
	CashFlow   float64 `json:"cash_flow" gorm:"default:0"`

	// Relationship
	Business Business `json:"-" gorm:"foreignKey:BusinessID;constraint:OnDelete:CASCADE"`
}

// TableName returns the table name for HistoricalProjection
func (HistoricalProjection) TableName() string {
	return "historical_projections"
}
