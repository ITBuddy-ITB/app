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

	// Initialize controllers
	investmentController := controllers.NewInvestmentController(investmentService)

	// Investment routes
	investmentGroup := router.Group("/investments")
	{
		investmentGroup.POST("", investmentController.CreateInvestment)
		investmentGroup.GET("", investmentController.GetAllInvestments)
		investmentGroup.GET("/:id", investmentController.GetInvestment)
		investmentGroup.PUT("/:id", investmentController.UpdateInvestment)
		investmentGroup.DELETE("/:id", investmentController.DeleteInvestment)

		// Additional investment routes for filtering
		investmentGroup.GET("/investor/:investor_id", investmentController.GetInvestmentsByInvestor)
		investmentGroup.GET("/business/:business_id", investmentController.GetInvestmentsByBusiness)
	}
}
