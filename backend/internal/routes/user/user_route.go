package user

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(router *gin.RouterGroup) {
	// Initialize services
	userService := services.NewUserService(database.DB)

	// Initialize controllers
	userController := controllers.NewUserController(userService)

	// User routes
	userGroup := router.Group("/users")
	{
		userGroup.GET("/:id", userController.GetUser)
		userGroup.PUT("/:id", userController.UpdateUser)
	}
}
