package routes

import (
	"go-gin-backend/internal/routes/auth"
	"go-gin-backend/internal/routes/business"
	"go-gin-backend/internal/routes/genai"
	"go-gin-backend/internal/routes/investment"
	"go-gin-backend/internal/routes/user"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Create an /api group
	api := router.Group("/api") 

	// Setup routes for each module under /api
	auth.SetupAuthRoutes(api)
	user.SetupUserRoutes(api)
	investment.SetupInvestmentRoutes(api)
	genai.SetupGenAIRoutes(api)
	business.SetupBusinessRoutes(api)
}
