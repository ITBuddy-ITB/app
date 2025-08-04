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

type MissingLegal struct {
	gorm.Model
	BusinessID uint   `json:"business_id"`
	LegalType  string `json:"legal_type"` // e.g. License, Certificate, Permit
	Notes      string `json:"notes,omitempty"`
}

type StepToGetLegal struct {
	gorm.Model	
	MissingLegalID uint   `json:"missing_legal_id"`
	StepNumber     int    `json:"step_number"`
	Description    string `json:"description"`
	RedirectURL   string `json:"redirect_url,omitempty"`
}

type MissingProductLegal struct {
	gorm.Model				
	ProductID uint   `json:"product_id"`
	LegalType  string `json:"legal_type"`
	Notes      string `json:"notes,omitempty"`
}

type StepToGetProductLegal struct {
	gorm.Model			
	MissingProductLegalID uint   `json:"missing_product_legal_id"`
	StepNumber     int    `json:"step_number"`
	Description    string `json:"description"`
	RedirectURL   string `json:"redirect_url,omitempty"`
}