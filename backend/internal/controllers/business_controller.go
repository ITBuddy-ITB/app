package controllers

import (
	"go-gin-backend/internal/models"
	"go-gin-backend/internal/services"
	"go-gin-backend/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BusinessController struct {
	businessService *services.BusinessService
}

func NewBusinessController(businessService *services.BusinessService) *BusinessController {
	return &BusinessController{businessService: businessService}
}

// GET /business/user/:userId -> get all businesses for a user
func (bc *BusinessController) GetUserBusinesses(c *gin.Context) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	businesses, err := bc.businessService.GetBusinessesByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch businesses"})
		return
	}

	c.JSON(http.StatusOK, businesses)
}

// ===== Step 1: Create Business + Products + Additional Info =====
type CreateBusinessRequest struct {
	UserID     uint                            `json:"user_id" binding:"required"`
	Business   models.Business                 `json:"business" binding:"required"`
	Additional []models.BusinessAdditionalInfo `json:"additional_info"`
	Products   []models.Product                `json:"products"`
}

func (bc *BusinessController) CreateBusiness(c *gin.Context) {
	var req CreateBusinessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Attach UserID
	req.Business.UserID = req.UserID

	err := bc.businessService.CreateBusiness(&req.Business, req.Additional, req.Products)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create business"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Business created successfully",
		"business": req.Business,
	})
}

// ===== Get Business =====
func (bc *BusinessController) GetBusiness(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	business, err := bc.businessService.GetBusinessByID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	c.JSON(http.StatusOK, business)
}

// ===== Update Business Basic Info =====
func (bc *BusinessController) UpdateBusiness(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	var business models.Business
	if err := c.ShouldBindJSON(&business); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	business.ID = uint(businessID)
	if err := bc.businessService.UpdateBusiness(&business); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update business"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Business updated successfully",
		"business": business,
	})
}

// ===== Delete Business =====
func (bc *BusinessController) DeleteBusiness(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	if err := bc.businessService.DeleteBusiness(uint(businessID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete business"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Business deleted successfully"})
}
