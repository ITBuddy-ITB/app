package models

import (
	"time"

	"gorm.io/gorm"
)

type Investment struct {
	gorm.Model              // This includes ID, CreatedAt, UpdatedAt, DeletedAt
	InvestorID       uint   `gorm:"not null" json:"investor_id"`
	BusinessID       uint   `gorm:"not null" json:"business_id"`
	TimeBought   *time.Time `json:"time_bought,omitempty"`
	TimeSold   *time.Time `json:"time_sold,omitempty"`
	InvestmentAmount float64 `gorm:"not null" json:"investment_amount"`
	InvestmentStatus string `gorm:"default:'buying'" json:"investment_status"`
}

const (
	InvestmentStatusPending   = "pending"
	InvestmentStatusApproved  = "approved"
	InvestmentStatusFunded    = "funded"
	InvestmentStatusActive    = "active"
	InvestmentStatusExited    = "exited"
	InvestmentStatusRejected  = "rejected"
	InvestmentStatusCancelled = "cancelled"
)
