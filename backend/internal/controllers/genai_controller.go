package controllers

import (
	"fmt"
	"go-gin-backend/internal/models"
	"go-gin-backend/internal/services"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type GenAIController struct {
	genAIService    *services.GenAIService
	businessService *services.BusinessService
}

func NewGenAIController(genAIService *services.GenAIService, businessService *services.BusinessService) *GenAIController {
	return &GenAIController{genAIService: genAIService, businessService: businessService}
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

func (gc *GenAIController) AnalyzeBusinessLegals(c *gin.Context) {
	var requestBody struct {
		BusinessID uint `json:"business_id"`
		IsRefresh  bool `json:"is_refresh"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(400, gin.H{"error": "Business ID is required in request body"})
		return
	}

	if requestBody.BusinessID == 0 {
		c.JSON(400, gin.H{"error": "Invalid business ID"})
		return
	}

	var analysis *models.LegalComparison
	var err error

	if !requestBody.IsRefresh {
		// Try to get existing analysis from database
		existingAnalysis, dbErr := gc.businessService.GetStoredLegalAnalysis(requestBody.BusinessID)
		if dbErr == nil && existingAnalysis != nil {
			// Return cached analysis
			c.JSON(200, existingAnalysis)
			return
		}
		// If error or no data found, continue to generate new analysis
	}

	// Generate new analysis using AI
	analysis, err = gc.genAIService.AnalyzeBusinessLegals(requestBody.BusinessID)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to analyze business legals: %v", err)})
		return
	}

	// Store the analysis results
	if requestBody.IsRefresh {
		// Clear existing analysis first
		if err := gc.businessService.ClearStoredLegalAnalysis(requestBody.BusinessID); err != nil {
			log.Printf("Failed to clear existing analysis: %v", err)
		}
	}

	if err := gc.businessService.StoreLegalAnalysisComparison(requestBody.BusinessID, analysis); err != nil {
		log.Printf("Failed to store analysis: %v", err)
	}

	c.JSON(200, analysis)
}

func (ctrl *GenAIController) GenerateBusinessSuggestions(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid business ID format",
			"message": "Business ID must be a valid number",
		})
		return
	}

	isRefresh := false
	if val := c.Query("isRefresh"); val == "true" {
		isRefresh = true
	}

	suggestions, err := ctrl.genAIService.GenerateBusinessSuggestions(uint(businessID), isRefresh)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Business not found",
				"message": "No business found with the specified ID",
			})
			return
		}
		log.Printf("Error generating business suggestions: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to generate suggestions",
			"message": "An error occurred while generating AI suggestions for your business",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    suggestions,
		"message": "Business suggestions generated successfully",
	})
}

func (ctrl *GenAIController) GenerateProjections(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid business ID format",
			"message": "Business ID must be a valid number",
		})
		return
	}

	isRefresh := false
	if val := c.Query("isRefresh"); val == "true" {
		isRefresh = true
	}

	projections, err := ctrl.genAIService.GenerateProjections(uint(businessID), isRefresh)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Business not found",
				"message": "No business found with the specified ID",
			})
			return
		}
		log.Printf("Error generating projections: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to generate projections",
			"message": "An error occurred while generating financial projections for your business",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    projections,
		"message": "Projections generated successfully",
	})
}