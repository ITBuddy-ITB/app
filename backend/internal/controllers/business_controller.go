package controllers

import (
	"go-gin-backend/internal/models"
	"go-gin-backend/internal/services"
	"go-gin-backend/internal/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// BusinessResponse represents the business data sent to frontend
type BusinessResponse struct {
	models.Business
	MarketCap        float64 `json:"market_cap"`
	EBITDAMultiplier float64 `json:"ebitda_multiplier"`
}

// convertToBusinessResponse converts a Business model to BusinessResponse
func convertToBusinessResponse(business models.Business) BusinessResponse {
	return BusinessResponse{
		Business:         business,
		MarketCap:        business.GetMarketCap(),
		EBITDAMultiplier: business.GetEBITDAMultiplier(),
	}
}

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

	// Convert to response format with calculated market cap
	var businessResponses []BusinessResponse
	for _, business := range businesses {
		businessResponses = append(businessResponses, convertToBusinessResponse(business))
	}

	c.JSON(http.StatusOK, businessResponses)
}

// GET /investment/businesses -> get all businesses for investment with pagination
func (bc *BusinessController) GetAllBusinessesForInvestment(c *gin.Context) {
	// Parse query parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	industry := c.Query("industry")
	search := c.Query("search")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	businesses, total, err := bc.businessService.GetAllBusinessesWithPagination(page, limit, industry, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch businesses"})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := gin.H{
		"businesses": businesses,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": totalPages,
	}

	c.JSON(http.StatusOK, response)
}

// GET /investment/businesses/:id -> get business details for investment
func (bc *BusinessController) GetBusinessForInvestment(c *gin.Context) {
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

// ===== Step 1: Create Business + Products + Additional Info =====
type CreateBusinessRequestData struct {
	Name        string `json:"name" binding:"required"`
	Type        string `json:"type,omitempty"`
	Description string `json:"description,omitempty"`
	Industry    string `json:"industry,omitempty"`
	FoundedAt   string `json:"founded_at,omitempty"` // Accept as string first
}

type CreateBusinessRequest struct {
	UserID     uint                            `json:"user_id" binding:"required"`
	Business   CreateBusinessRequestData       `json:"business" binding:"required"`
	Additional []models.BusinessAdditionalInfo `json:"additional_info"`
	Products   []models.Product                `json:"products"`
}

func (bc *BusinessController) CreateBusiness(c *gin.Context) {
	var req CreateBusinessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert the request data to Business model
	business := models.Business{
		UserID:      req.UserID,
		Name:        req.Business.Name,
		Type:        req.Business.Type,
		Description: req.Business.Description,
		Industry:    req.Business.Industry,
	}

	// Parse founded_at if provided
	if req.Business.FoundedAt != "" {
		if parsedTime, err := time.Parse("2006-01-02", req.Business.FoundedAt); err == nil {
			business.FoundedAt = &parsedTime
		}
	}

	err := bc.businessService.CreateBusiness(&business, req.Additional, req.Products)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create business"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Business created successfully",
		"business": business,
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

	// Convert to response format with calculated market cap
	businessResponse := convertToBusinessResponse(*business)
	c.JSON(http.StatusOK, businessResponse)
}

// ===== Update Business Basic Info =====
func (bc *BusinessController) UpdateBusiness(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	var req CreateBusinessRequestData
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert the request data to Business model
	business := models.Business{
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Industry:    req.Industry,
	}

	// Parse founded_at if provided
	if req.FoundedAt != "" {
		if parsedTime, err := time.Parse("2006-01-02", req.FoundedAt); err == nil {
			business.FoundedAt = &parsedTime
		}
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

// ===== Product Management =====
func (bc *BusinessController) GetBusinessProducts(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	products, err := bc.businessService.GetBusinessProducts(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

type AddProductsRequest struct {
	Products []models.Product `json:"products" binding:"required"`
}

func (bc *BusinessController) AddBusinessProducts(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	var req AddProductsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set business ID for all products
	for i := range req.Products {
		req.Products[i].BusinessID = uint(businessID)
	}

	addedProducts, err := bc.businessService.AddBusinessProducts(uint(businessID), req.Products)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add products"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Products added successfully",
		"products": addedProducts,
	})
}

func (bc *BusinessController) UpdateBusinessProduct(c *gin.Context) {
	businessIDStr := c.Param("id")
	productIDStr := c.Param("productId")

	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = bc.businessService.UpdateBusinessProduct(uint(businessID), uint(productID), updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func (bc *BusinessController) DeleteBusinessProduct(c *gin.Context) {
	businessIDStr := c.Param("id")
	productIDStr := c.Param("productId")

	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	err = bc.businessService.DeleteBusinessProduct(uint(businessID), uint(productID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// ===== Legal Document Management =====
func (bc *BusinessController) GetBusinessLegal(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	legals, err := bc.businessService.GetBusinessLegal(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch legal documents"})
		return
	}

	c.JSON(http.StatusOK, legals)
}

func (bc *BusinessController) AddBusinessLegal(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	// Handle multipart form data
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	legalType := c.PostForm("legal_type")
	issuedBy := c.PostForm("issued_by")
	validUntil := c.PostForm("valid_until")
	notes := c.PostForm("notes")

	legal, err := bc.businessService.AddBusinessLegal(uint(businessID), file, header, legalType, issuedBy, validUntil, notes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add legal document"})
		return
	}

	c.JSON(http.StatusCreated, legal)
}

func (bc *BusinessController) GetProductsLegal(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	legals, err := bc.businessService.GetProductsLegal(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product legal documents"})
		return
	}

	c.JSON(http.StatusOK, legals)
}

func (bc *BusinessController) AddProductLegal(c *gin.Context) {
	businessIDStr := c.Param("id")
	productIDStr := c.Param("productId")

	businessID, err := strconv.ParseUint(businessIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Handle multipart form data
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	legalType := c.PostForm("legal_type")
	issuedBy := c.PostForm("issued_by")
	validUntil := c.PostForm("valid_until")
	notes := c.PostForm("notes")

	legal, err := bc.businessService.AddProductLegal(uint(businessID), uint(productID), file, header, legalType, issuedBy, validUntil, notes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add product legal document"})
		return
	}

	c.JSON(http.StatusCreated, legal)
}

// func (bc *BusinessController) GetLegalComparison(c *gin.Context) {
// 	businessID := c.GetUint("businessId")

// 	comparison, err := bc.businessService.GetLegalComparison(businessID)
// 	if err != nil {
// 		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to get legal comparison: %v", err)})
// 		return
// 	}

// 	c.JSON(200, comparison)
// }

// ===== Financial Data Management =====

// GET /business/:id/financial -> get financial data for business
func (bc *BusinessController) GetBusinessFinancial(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.Atoi(businessIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	_, err = utils.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Verify business exists
	_, err = bc.businessService.GetBusinessByID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	financial, err := bc.businessService.GetFinancialData(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch financial data"})
		return
	}

	c.JSON(http.StatusOK, financial)
}

// GET /business/:id/financial/history -> get financial history for business
func (bc *BusinessController) GetBusinessFinancialHistory(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.Atoi(businessIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	_, err = utils.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Verify business exists
	_, err = bc.businessService.GetBusinessByID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	financials, err := bc.businessService.GetFinancialHistory(uint(businessID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch financial history"})
		return
	}

	c.JSON(http.StatusOK, financials)
}

type UpdateFinancialRequest struct {
	EBITDA      *float64 `json:"ebitda,omitempty"`
	Assets      *float64 `json:"assets,omitempty"`
	Liabilities *float64 `json:"liabilities,omitempty"`
	Equity      *float64 `json:"equity,omitempty"`
	Notes       *string  `json:"notes,omitempty"`
}

type CreateFinancialRequest struct {
	Revenue     *float64 `json:"revenue,omitempty"`
	EBITDA      *float64 `json:"ebitda,omitempty"`
	Assets      *float64 `json:"assets,omitempty"`
	Liabilities *float64 `json:"liabilities,omitempty"`
	Equity      *float64 `json:"equity,omitempty"`
	Notes       *string  `json:"notes,omitempty"`
}

// PUT /business/:id/financial -> update financial data for business
func (bc *BusinessController) UpdateBusinessFinancial(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.Atoi(businessIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	_, err = utils.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Verify business exists
	_, err = bc.businessService.GetBusinessByID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	var req UpdateFinancialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	financial, err := bc.businessService.UpdateFinancialData(uint(businessID), req.EBITDA, req.Assets, req.Liabilities, req.Equity, req.Notes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update financial data"})
		return
	}

	c.JSON(http.StatusOK, financial)
}

// POST /business/:id/financial -> create new financial data for business
func (bc *BusinessController) CreateBusinessFinancial(c *gin.Context) {
	businessIDStr := c.Param("id")
	businessID, err := strconv.Atoi(businessIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	_, err = utils.GetUserIDFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Verify business exists
	_, err = bc.businessService.GetBusinessByID(uint(businessID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	var req CreateFinancialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	financial, err := bc.businessService.CreateFinancialData(uint(businessID), req.Revenue, req.EBITDA, req.Assets, req.Liabilities, req.Equity, req.Notes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create financial data"})
		return
	}

	c.JSON(http.StatusCreated, financial)
}
