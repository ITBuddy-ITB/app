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
		allowedOrigins = "http://localhost:3000,http://localhost:5173" // Default origins for development
	}

	config := cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Split the allowed origins and check if the request origin is in the list
			allowed := strings.Split(allowedOrigins, ",")
			for _, allowedOrigin := range allowed {
				if strings.TrimSpace(allowedOrigin) == origin {
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
