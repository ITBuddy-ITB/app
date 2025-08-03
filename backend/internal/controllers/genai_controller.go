package controllers

import (
	"fmt"
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

func (gc *GenAIController) GetProductsFromFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"error": "File is required"})
		return
	}

	products, err := gc.genAIService.InferProductsFromFile(file)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to process file: %v", err)})
		return
	}

	c.JSON(200, gin.H{"products": products})
}
