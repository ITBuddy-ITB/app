package controllers

import (
	"go-gin-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type GenAIController struct {
	genAIService *services.GenAIService
}

func NewGenAIController(genAIService *services.GenAIService) *GenAIController {
	return &GenAIController{genAIService: genAIService}
}

func (gc *GenAIController) GetAIResponse(c *gin.Context) {
	input := c.Query("input")
	response := gc.genAIService.GetAIResponse(input)
	c.JSON(200, gin.H{"response": response})
}

func GetDocs(c *gin.Context) {}
