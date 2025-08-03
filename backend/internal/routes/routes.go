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
	// Setup routes for each module
	auth.SetupAuthRoutes(router)
	user.SetupUserRoutes(router)
	investment.SetupInvestmentRoutes(router)
	genai.SetupGenAIRoutes(router)
	business.SetupBusinessRoutes(router)
}
