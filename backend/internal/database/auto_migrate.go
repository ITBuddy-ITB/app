package database

import (
	"go-gin-backend/internal/models"

	"gorm.io/gorm"
)

// AutoMigrateAll will migrate all registered models
func AutoMigrateAll(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
	)
}
