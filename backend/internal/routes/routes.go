package routes

import (
	"go-gin-backend/internal/controllers"
	"go-gin-backend/internal/database"
	"go-gin-backend/internal/services"
	"os"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Initialize services
	userService := services.NewUserService(database.DB)
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key" // Default for development
	}
	authService := services.NewAuthService(userService, jwtSecret)

	// Initialize controllers
	authController := controllers.NewAuthController(authService)
	userController := controllers.NewUserController(userService)

	// Authentication routes
	router.POST("/register", authController.Register)
	router.POST("/login", authController.Login)

	// User routes
	router.GET("/users/:id", userController.GetUser)
	router.PUT("/users/:id", userController.UpdateUser)
}
