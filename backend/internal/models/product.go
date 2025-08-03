package models

import (
	"time"

	"gorm.io/gorm"
)

// ================== PRODUCT ==================
type Product struct {
	gorm.Model
	BusinessID uint   `json:"business_id"`
	Name       string `gorm:"not null" json:"name"`

	// Relations
	ProductLegals []ProductLegal `gorm:"foreignKey:ProductID" json:"product_legals,omitempty"`
}

// ================== PRODUCT LEGAL ==================
type ProductLegal struct {
	gorm.Model
	ProductID uint `json:"product_id"`

	FileName   string     `json:"file_name,omitempty"`
	FileURL    string     `json:"file_url,omitempty"`
	LegalType  string     `json:"legal_type,omitempty"` // e.g. Halal, BPOM, Patent
	IssuedBy   string     `json:"issued_by,omitempty"`
	IssuedAt   *time.Time `json:"issued_at,omitempty"`
	ValidUntil *time.Time `json:"valid_until,omitempty"`
	Notes      string     `json:"notes,omitempty"`

	// Relations
	Product Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}
