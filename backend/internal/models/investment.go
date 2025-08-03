package models

import (
	"gorm.io/gorm"
)

type Investment struct {
	gorm.Model              // This includes ID, CreatedAt, UpdatedAt, DeletedAt
	InvestorID       uint   `gorm:"not null" json:"investor_id"`
	BusinessID       uint   `gorm:"not null" json:"business_id"`
	InvestmentAmount float64 `gorm:"not null" json:"investment_amount"`
}
