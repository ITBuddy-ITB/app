package models

import "gorm.io/gorm"

type BusinessAISuggestion struct {
	gorm.Model
	BusinessID   uint                        `gorm:"not null;index" json:"business_id"`
	BusinessName string                      `json:"business_name"`
	GeneratedAt  string                      `json:"generated_at"`
	Suggestions  []BusinessAISuggestionItem  `gorm:"foreignKey:BusinessAISuggestionID" json:"suggestions"`
}

type BusinessAISuggestionItem struct {
	gorm.Model
	BusinessAISuggestionID uint   `gorm:"not null;index"`
	Suggestion             string `json:"suggestion"`
	Category               string `json:"category"`
	Priority               string `json:"priority"`
}