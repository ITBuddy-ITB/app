package models

import "gorm.io/gorm"

type BusinessProjection struct {
	gorm.Model
	BusinessID   uint                        `json:"business_id"`
	BusinessName string                      `json:"business_name"`
	GeneratedAt  string                      `json:"generated_at"`
	Items        []BusinessProjectionItem    `gorm:"foreignKey:ProjectionID" json:"items,omitempty"`
}

type BusinessProjectionItem struct {
	gorm.Model
	ProjectionID uint    `json:"projection_id"`
	Year         int     `json:"year"`
	Revenue      float64 `json:"revenue"`
	Expenses     float64 `json:"expenses"`
	NetIncome    float64 `json:"net_income"`
	CashFlow     float64 `json:"cash_flow"`
}
