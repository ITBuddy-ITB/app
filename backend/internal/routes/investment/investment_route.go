package investment

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/middleware"
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
		// Public routes (for browsing businesses)
		investmentGroup.GET("/businesses", businessController.GetAllBusinessesForInvestment)
		investmentGroup.GET("/businesses/:id", businessController.GetBusinessForInvestment)

		// Protected routes (require authentication)
		protectedGroup := investmentGroup.Group("")
		protectedGroup.Use(middleware.AuthMiddleware())
		{
			// Core investment operations
			protectedGroup.POST("", investmentController.CreateInvestment)
			protectedGroup.GET("", investmentController.GetAllInvestments)
			protectedGroup.GET("/:id", investmentController.GetInvestment)
			protectedGroup.PUT("/:id", investmentController.UpdateInvestment)
			protectedGroup.DELETE("/:id", investmentController.DeleteInvestment)

			// Investment filtering routes
			protectedGroup.GET("/investor/:investor_id", investmentController.GetInvestmentsByInvestor)
			protectedGroup.GET("/business/:business_id", investmentController.GetInvestmentsByBusiness)
			protectedGroup.GET("/user/business/:business_id", investmentController.GetUserInvestmentsForBusiness)
		}
	}
}
