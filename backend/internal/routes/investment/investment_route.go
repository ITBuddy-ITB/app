package investment

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupInvestmentRoutes(router *gin.Engine) {
	// Initialize services
	investmentService := services.NewInvestmentService(database.DB)
	businessService := services.NewBusinessService(database.DB)

	// Initialize controllers
	investmentController := controllers.NewInvestmentController(investmentService)
	businessController := controllers.NewBusinessController(businessService)

	// Investment routes
	investmentGroup := router.Group("/investment")
	{
		// Core investment operations
		investmentGroup.POST("", investmentController.CreateInvestment)
		investmentGroup.GET("", investmentController.GetAllInvestments)
		investmentGroup.GET("/:id", investmentController.GetInvestment)
		investmentGroup.PUT("/:id", investmentController.UpdateInvestment)
		investmentGroup.DELETE("/:id", investmentController.DeleteInvestment)

		// Investment filtering routes
		investmentGroup.GET("/investor/:investor_id", investmentController.GetInvestmentsByInvestor)
		investmentGroup.GET("/business/:business_id", investmentController.GetInvestmentsByBusiness)

		// Business discovery for investment
		investmentGroup.GET("/businesses", businessController.GetAllBusinessesForInvestment)
		investmentGroup.GET("/businesses/:id", businessController.GetBusinessForInvestment)
	}
}
