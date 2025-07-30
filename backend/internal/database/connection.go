package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Auto-migrate the schema
	err = AutoMigrateAll(DB)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("Database connected and migrated successfully")
}
