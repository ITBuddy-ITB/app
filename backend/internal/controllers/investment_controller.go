package controllers

import (
	"go-gin-backend/internal/models"
	"go-gin-backend/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type InvestmentController struct {
	investmentService *services.InvestmentService
}

func NewInvestmentController(investmentService *services.InvestmentService) *InvestmentController {
	return &InvestmentController{investmentService: investmentService}
}

// CreateInvestment creates a new investment
func (ic *InvestmentController) CreateInvestment(c *gin.Context) {
	var investment models.Investment
	if err := c.ShouldBindJSON(&investment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ic.investmentService.CreateInvestment(&investment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create investment"})
		return
	}

	c.JSON(http.StatusCreated, investment)
}

// GetInvestment retrieves an investment by ID
func (ic *InvestmentController) GetInvestment(c *gin.Context) {
	investmentIDStr := c.Param("id")
	investmentID, err := strconv.ParseUint(investmentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investment ID"})
		return
	}

	investment, err := ic.investmentService.GetInvestmentByID(uint(investmentID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Investment not found"})
		return
	}

	c.JSON(http.StatusOK, investment)
}

// GetAllInvestments retrieves all investments
func (ic *InvestmentController) GetAllInvestments(c *gin.Context) {
	investments, err := ic.investmentService.GetAllInvestments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve investments"})
		return
	}

	c.JSON(http.StatusOK, investments)
}

// GetInvestmentsByInvestor retrieves investments by investor ID
func (ic *InvestmentController) GetInvestmentsByInvestor(c *gin.Context) {
	investorIDStr := c.Param("investor_id")
	investorID, err := strconv.ParseUint(investorIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investor ID"})
		return
	}

	investments, err := ic.investmentService.GetInvestmentsByInvestorID(uint(investorID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve investments"})
		return
	}

	c.JSON(http.StatusOK, investments)
}

// GetInvestmentsByBusiness retrieves investments by business ID
func (ic *InvestmentController) GetInvestmentsByBusiness(c *gin.Context) {
	businessIDStr := c.Param("business_id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	investments, err := ic.investmentService.GetInvestmentsByBusinessID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve investments"})
		return
	}

	c.JSON(http.StatusOK, investments)
}

// UpdateInvestment updates an existing investment
func (ic *InvestmentController) UpdateInvestment(c *gin.Context) {
	investmentIDStr := c.Param("id")
	investmentID, err := strconv.ParseUint(investmentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investment ID"})
		return
	}

	var investment models.Investment
	if err := c.ShouldBindJSON(&investment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the ID for the update
	investment.ID = uint(investmentID)
	err = ic.investmentService.UpdateInvestment(&investment)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Investment not found"})
		return
	}

	c.JSON(http.StatusOK, investment)
}

// DeleteInvestment deletes an investment by ID
func (ic *InvestmentController) DeleteInvestment(c *gin.Context) {
	investmentIDStr := c.Param("id")
	investmentID, err := strconv.ParseUint(investmentIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid investment ID"})
		return
	}

	err = ic.investmentService.DeleteInvestment(uint(investmentID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Investment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Investment deleted successfully"})
}
