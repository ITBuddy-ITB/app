package investment

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupInvestmentRoutes(router *gin.Engine) {
	// Initialize services
	businessService := services.NewBusinessService(database.DB)

	// Initialize controllers
	businessController := controllers.NewBusinessController(businessService)

	// Investment routes
	investmentGroup := router.Group("/investment")
	{
		// Public routes (for browsing businesses)
		investmentGroup.GET("/businesses", businessController.GetAllBusinessesForInvestment)
		investmentGroup.GET("/businesses/:id", businessController.GetBusinessForInvestment)
	}
}
