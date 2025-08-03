package main

import (
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/routes"
	"log"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize the database connection
	database.Connect()

	// Create a new Gin router
	router := gin.Default()

	// Configure CORS
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000,http://localhost:5173,http://localhost:4001,http://localhost:4000" // Default origins for development
	}

	config := cors.Config{
		AllowOriginFunc: func(origin string) bool {
			allowed := strings.Split(allowedOrigins, ",")
			origin = strings.TrimSuffix(origin, "/")
			for _, allowedOrigin := range allowed {
				if strings.TrimSuffix(strings.TrimSpace(allowedOrigin), "/") == origin {
					return true
				}
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(config))

	// Serve static files from uploads directory
	router.Static("/uploads", "./uploads")

	// Setup application routes
	routes.SetupRoutes(router)

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	router.Run(":" + port)
}
