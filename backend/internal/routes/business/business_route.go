package business

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupBusinessRoutes(router *gin.Engine) {
	// Init service
	businessService := services.NewBusinessService(database.DB)

	// Init controller
	businessController := controllers.NewBusinessController(businessService)

	// Business routes
	businessGroup := router.Group("/business")
	{
		businessGroup.POST("", businessController.CreateBusiness)        // Create
		businessGroup.GET("/:id", businessController.GetBusiness)        // Fetch one
		businessGroup.PUT("/:id", businessController.UpdateBusiness)     // Update
		businessGroup.DELETE("/:id", businessController.DeleteBusiness)  // Delete
		businessGroup.GET("/user", businessController.GetUserBusinesses) // Fetch User's business

		// Product management routes
		businessGroup.GET("/:id/products", businessController.GetBusinessProducts)
		businessGroup.POST("/:id/products", businessController.AddBusinessProducts)
		businessGroup.PUT("/:id/products/:productId", businessController.UpdateBusinessProduct)
		businessGroup.DELETE("/:id/products/:productId", businessController.DeleteBusinessProduct)

		// Legal document routes
		businessGroup.GET("/:id/legal", businessController.GetBusinessLegal)
		businessGroup.POST("/:id/legal", businessController.AddBusinessLegal)
		businessGroup.GET("/:id/products/legal", businessController.GetProductsLegal)
		businessGroup.POST("/:id/products/:productId/legal", businessController.AddProductLegal)

		// Financial data routes
		businessGroup.GET("/:id/financial", businessController.GetBusinessFinancial)
		businessGroup.GET("/:id/financial/history", businessController.GetBusinessFinancialHistory)
		businessGroup.PUT("/:id/financial", businessController.UpdateBusinessFinancial)
	}
}
