package models

import (
	"time"

	"gorm.io/gorm"
)

// ================== LEGAL (BUSINESS-LEVEL) ==================
type Legal struct {
	gorm.Model
	BusinessID uint `json:"business_id"`

	FileName   string     `json:"file_name,omitempty"`
	FileURL    string     `json:"file_url,omitempty"`
	LegalType  string     `json:"legal_type,omitempty"` // e.g. License, Certificate, Permit
	IssuedBy   string     `json:"issued_by,omitempty"`
	IssuedAt   *time.Time `json:"issued_at,omitempty"`
	ValidUntil *time.Time `json:"valid_until,omitempty"`
	Notes      string     `json:"notes,omitempty"`
}

type LegalAdditionalInfo struct {
	gorm.Model
	LegalID uint   `gorm:"unique" json:"legal_id"`
	Name    string `json:"name"`
	Value   string `json:"value"`
}
