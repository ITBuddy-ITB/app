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
	}
}
