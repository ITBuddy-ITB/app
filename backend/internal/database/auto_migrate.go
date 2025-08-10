package database

import (
	"go-gin-backend/internal/models"

	"gorm.io/gorm"
)

// AutoMigrateAll will migrate all registered models
func AutoMigrateAll(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Business{},
		&models.BusinessAdditionalInfo{},
		&models.Product{},
		&models.ProductLegal{},
		&models.Financial{},
		&models.FinancialAdditionalInfo{},
		&models.Legal{},
		&models.LegalAdditionalInfo{},
		&models.MissingLegal{},
		&models.StepToGetLegal{},
		&models.MissingProductLegal{},
		&models.StepToGetProductLegal{},
		&models.BusinessAISuggestion{},
		&models.BusinessAISuggestionItem{},
		&models.HistoricalProjection{},
	)
}
