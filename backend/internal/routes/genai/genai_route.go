package genai

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupGenAIRoutes(router *gin.Engine) {
	// Initialize services
	genAIService := services.NewGenAIService(database.DB)

	// Initialize controllers
	genAIController := controllers.NewGenAIController(genAIService)

	// User routes
	genAIGroup := router.Group("/genai")
	{
		genAIGroup.GET("/response", genAIController.GetAIResponse)
		genAIGroup.POST("/infer-products", genAIController.GetProductsFromFile)
	}
}
