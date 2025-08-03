package models

import (
	"time"

	"gorm.io/gorm"
)

type Business struct {
	gorm.Model
	Name        string     `gorm:"not null" json:"name"` // required
	Type        string     `json:"type,omitempty"`
	MarketCap   *float64   `json:"market_cap,omitempty"` // optional
	Description string     `json:"description,omitempty"`
	Industry    string     `json:"industry,omitempty"`
	FoundedAt   *time.Time `json:"founded_at,omitempty"`

	// Relations
	Legals    []Legal    `gorm:"foreignKey:BusinessID" json:"legals,omitempty"`
	Products  []Product  `gorm:"foreignKey:BusinessID" json:"products,omitempty"`
	Financial *Financial `gorm:"foreignKey:BusinessID" json:"financial,omitempty"`
}

type BusinessAdditionalInfo struct {
	gorm.Model
	BusinessID uint   `gorm:"unique" json:"business_id"`
	Name       string `json:"name"`
	Value      string `json:"value"`
}
