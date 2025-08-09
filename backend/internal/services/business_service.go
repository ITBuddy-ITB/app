package services

import (
	"fmt"
	"go-gin-backend/internal/models"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"gorm.io/gorm"
)

type BusinessService struct {
	DB *gorm.DB
}

func NewBusinessService(db *gorm.DB) *BusinessService {
	return &BusinessService{DB: db}
}

// Get all businesses by user_id
func (s *BusinessService) GetBusinessesByUserID(userID uint) ([]models.Business, error) {
	var businesses []models.Business
	if err := s.DB.
		Preload("Products").
		Preload("Financials", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC") // Load financials ordered by most recent first
		}).
		Preload("Legals").
		Where("user_id = ?", userID).
		Find(&businesses).Error; err != nil {
		return nil, err
	}

	// Set the latest financial record as the primary financial for compatibility
	for i := range businesses {
		if len(businesses[i].Financials) > 0 {
			businesses[i].Financial = &businesses[i].Financials[0] // Most recent is first due to DESC order
		}
	}

	return businesses, nil
}

// Create new business
func (s *BusinessService) CreateBusiness(business *models.Business, additionalInfo []models.BusinessAdditionalInfo, products []models.Product) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(business).Error; err != nil {
			return err
		}

		for i := range additionalInfo {
			additionalInfo[i].BusinessID = business.ID
		}
		if len(additionalInfo) > 0 {
			if err := tx.Create(&additionalInfo).Error; err != nil {
				return err
			}
		}

		for i := range products {
			products[i].BusinessID = business.ID
		}
		if len(products) > 0 {
			if err := tx.Create(&products).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// Get business with relations
func (s *BusinessService) GetBusinessByID(id uint) (*models.Business, error) {
	var business models.Business
	if err := s.DB.Preload("Legals").
		Preload("Products").
		Preload("Financials", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC") // Load financials ordered by most recent first
		}).
		First(&business, id).Error; err != nil {
		return nil, err
	}

	// Set the latest financial record as the primary financial for compatibility
	if len(business.Financials) > 0 {
		business.Financial = &business.Financials[0] // Most recent is first due to DESC order
	}

	return &business, nil
}

// Update business basic info
func (s *BusinessService) UpdateBusiness(business *models.Business) error {
	return s.DB.Save(business).Error
}

// Delete business
func (s *BusinessService) DeleteBusiness(id uint) error {
	return s.DB.Delete(&models.Business{}, id).Error
}

// ===== Product Management =====
func (s *BusinessService) GetBusinessProducts(businessID uint) ([]models.Product, error) {
	var products []models.Product
	if err := s.DB.Where("business_id = ?", businessID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (s *BusinessService) AddBusinessProducts(businessID uint, products []models.Product) ([]models.Product, error) {
	for i := range products {
		products[i].BusinessID = businessID
	}

	if err := s.DB.Create(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

func (s *BusinessService) UpdateBusinessProduct(businessID, productID uint, updateData map[string]interface{}) error {
	return s.DB.Model(&models.Product{}).
		Where("id = ? AND business_id = ?", productID, businessID).
		Updates(updateData).Error
}

func (s *BusinessService) DeleteBusinessProduct(businessID, productID uint) error {
	return s.DB.Where("id = ? AND business_id = ?", productID, businessID).
		Delete(&models.Product{}).Error
}

// ===== Legal Document Management =====
func (s *BusinessService) GetBusinessLegal(businessID uint) ([]models.Legal, error) {
	var legals []models.Legal
	if err := s.DB.Where("business_id = ?", businessID).Find(&legals).Error; err != nil {
		return nil, err
	}
	return legals, nil
}

func (s *BusinessService) AddBusinessLegal(businessID uint, file multipart.File, header *multipart.FileHeader, legalType, issuedBy, validUntil, notes string) (*models.Legal, error) {
	// Create upload directory if it doesn't exist
	uploadDir := "uploads/legal/business"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %v", err)
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%d_%s", businessID, time.Now().Unix(), header.Filename)
	filePath := filepath.Join(uploadDir, filename)

	// Create the file on disk
	dst, err := os.Create(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %v", err)
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	if _, err := io.Copy(dst, file); err != nil {
		return nil, fmt.Errorf("failed to save file: %v", err)
	}

	// Create URL for frontend access (relative to server root)
	fileURL := fmt.Sprintf("/uploads/legal/business/%s", filename)

	legal := &models.Legal{
		BusinessID: businessID,
		FileName:   header.Filename,
		FileURL:    fileURL,
		LegalType:  legalType,
		IssuedBy:   issuedBy,
		Notes:      notes,
	}

	if validUntil != "" {
		if parsedTime, err := time.Parse("2006-01-02", validUntil); err == nil {
			legal.ValidUntil = &parsedTime
		}
	}

	if err := s.DB.Create(legal).Error; err != nil {
		return nil, err
	}

	return legal, nil
}

func (s *BusinessService) GetProductsLegal(businessID uint) ([]models.ProductLegal, error) {
	var legals []models.ProductLegal

	// Use a simpler approach: get all products for the business first
	var productIDs []uint
	if err := s.DB.Model(&models.Product{}).
		Where("business_id = ?", businessID).
		Pluck("id", &productIDs).Error; err != nil {
		return nil, err
	}

	// Then get all legal documents for those products
	if len(productIDs) > 0 {
		if err := s.DB.Preload("Product").
			Where("product_id IN ?", productIDs).
			Find(&legals).Error; err != nil {
			return nil, err
		}
	}

	return legals, nil
}

func (s *BusinessService) AddProductLegal(businessID, productID uint, file multipart.File, header *multipart.FileHeader, legalType, issuedBy, validUntil, notes string) (*models.ProductLegal, error) {
	// First verify the product belongs to the business
	var product models.Product
	if err := s.DB.Where("id = ? AND business_id = ?", productID, businessID).First(&product).Error; err != nil {
		return nil, err
	}

	// Create upload directory if it doesn't exist
	uploadDir := "uploads/legal/products"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %v", err)
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%d_%d_%s", businessID, productID, time.Now().Unix(), header.Filename)
	filePath := filepath.Join(uploadDir, filename)

	// Create the file on disk
	dst, err := os.Create(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to create file: %v", err)
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	if _, err := io.Copy(dst, file); err != nil {
		return nil, fmt.Errorf("failed to save file: %v", err)
	}

	// Create URL for frontend access (relative to server root)
	fileURL := fmt.Sprintf("/uploads/legal/products/%s", filename)

	legal := &models.ProductLegal{
		ProductID: productID,
		FileName:  header.Filename,
		FileURL:   fileURL,
		LegalType: legalType,
		IssuedBy:  issuedBy,
		Notes:     notes,
	}

	if validUntil != "" {
		if parsedTime, err := time.Parse("2006-01-02", validUntil); err == nil {
			legal.ValidUntil = &parsedTime
		}
	}

	if err := s.DB.Create(legal).Error; err != nil {
		return nil, err
	}

	return legal, nil
}

// ===== Financial Data Management =====

// Get financial data for a business
func (s *BusinessService) GetFinancialData(businessID uint) (*models.Financial, error) {
	var financial models.Financial
	if err := s.DB.Where("business_id = ?", businessID).First(&financial).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Return empty financial record if not found
			return &models.Financial{BusinessID: businessID}, nil
		}
		return nil, err
	}
	return &financial, nil
}

// Get financial history for a business
func (s *BusinessService) GetFinancialHistory(businessID uint) ([]models.Financial, error) {
	var financials []models.Financial
	if err := s.DB.Where("business_id = ?", businessID).
		Order("created_at DESC").
		Find(&financials).Error; err != nil {
		return nil, err
	}
	return financials, nil
}

// Update financial data for a business
func (s *BusinessService) UpdateFinancialData(businessID uint, ebitda, assets, liabilities, equity *float64, notes *string) (*models.Financial, error) {
	var financial models.Financial

	// Try to find existing financial record
	err := s.DB.Where("business_id = ?", businessID).First(&financial).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	// If record doesn't exist, create new one
	if err == gorm.ErrRecordNotFound {
		financial = models.Financial{BusinessID: businessID}
	}

	// Update fields if provided
	if ebitda != nil {
		financial.EBITDA = *ebitda
	}
	if assets != nil {
		financial.Assets = *assets
	}
	if liabilities != nil {
		financial.Liabilities = *liabilities
	}
	if equity != nil {
		financial.Equity = *equity
	}
	if notes != nil {
		financial.Notes = *notes
	}

	// Save the record
	if err := s.DB.Save(&financial).Error; err != nil {
		return nil, err
	}

	return &financial, nil
}

// ===== Investment-related methods =====

// GetAllBusinessesWithPagination gets all businesses with pagination and filters for investment purposes
func (s *BusinessService) GetAllBusinessesWithPagination(page, limit int, industry, search string) ([]models.Business, int64, error) {
	var businesses []models.Business
	var total int64

	query := s.DB.Model(&models.Business{}).
		Preload("Products").
		Preload("Financials", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC") // Load financials ordered by most recent first
		}).
		Preload("Legals")

	// Apply filters
	if industry != "" {
		query = query.Where("industry = ?", industry)
	}
	if search != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit
	if err := query.Offset(offset).Limit(limit).Find(&businesses).Error; err != nil {
		return nil, 0, err
	}

	// Set the latest financial record as the primary financial for compatibility
	for i := range businesses {
		if len(businesses[i].Financials) > 0 {
			businesses[i].Financial = &businesses[i].Financials[0] // Most recent is first due to DESC order
		}
	}

	return businesses, total, nil
}

func (s *BusinessService) StoreLegalAnalysisComparison(businessID uint, comparison *models.LegalComparison) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		// Clear existing analysis for this business (optional - depends on your requirements)
		if err := tx.Where("business_id = ?", businessID).Delete(&models.MissingLegal{}).Error; err != nil {
			return err
		}
		if err := tx.Where("product_id IN (SELECT id FROM products WHERE business_id = ?)", businessID).
			Delete(&models.MissingProductLegal{}).Error; err != nil {
			return err
		}

		// Store business legals that are missing
		for _, required := range comparison.Required {
			if !required.HasLegal && len(required.Steps) > 0 {
				missingLegal := &models.MissingLegal{
					BusinessID: businessID,
					LegalType:  required.Type,
					Notes:      required.Notes,
				}
				if err := tx.Create(missingLegal).Error; err != nil {
					return err
				}

				// Store steps for this legal
				for _, step := range required.Steps {
					legalStep := &models.StepToGetLegal{
						MissingLegalID: missingLegal.ID,
						StepNumber:     step.StepNumber,
						Description:    step.Description,
						RedirectURL:    step.RedirectURL,
					}
					if err := tx.Create(legalStep).Error; err != nil {
						return err
					}
				}
			}
		}

		// Store product legals that are missing
		for _, prodComparison := range comparison.Products {
			// Find product by name
			var product models.Product
			if err := tx.Where("business_id = ? AND name LIKE ?", businessID, "%"+prodComparison.ProductName+"%").
				First(&product).Error; err != nil {
				continue // Skip if product not found
			}

			for _, required := range prodComparison.Required {
				if !required.HasLegal && len(required.Steps) > 0 {
					missingLegal := &models.MissingProductLegal{
						ProductID: product.ID,
						LegalType: required.Type,
						Notes:     required.Notes,
					}
					if err := tx.Create(missingLegal).Error; err != nil {
						return err
					}

					// Store steps for this product legal
					for _, step := range required.Steps {
						legalStep := &models.StepToGetProductLegal{
							MissingProductLegalID: missingLegal.ID,
							StepNumber:            step.StepNumber,
							Description:           step.Description,
							RedirectURL:           step.RedirectURL,
						}
						if err := tx.Create(legalStep).Error; err != nil {
							return err
						}
					}
				}
			}
		}

		return nil
	})
}

// GetStoredLegalAnalysis retrieves ALL legal analysis (existing + missing) from the database
func (s *BusinessService) GetStoredLegalAnalysis(businessID uint) (*models.LegalComparison, error) {
	var (
		missingLegals        []models.MissingLegal
		missingProductLegals []models.MissingProductLegal
		existingLegals       []models.Legal
		existingProductLegals []models.ProductLegal
		products             []models.Product
	)

	// Get existing business legals
	if err := s.DB.Where("business_id = ?", businessID).Find(&existingLegals).Error; err != nil {
		return nil, err
	}

	// Get existing product legals (with product relation for mapping)
	if err := s.DB.
		Joins("JOIN products ON products.id = product_legals.product_id").
		Where("products.business_id = ?", businessID).
		Find(&existingProductLegals).Error; err != nil {
		return nil, err
	}

	// Get missing business legals with steps
	if err := s.DB.Preload("StepsToGetLegal").
		Where("business_id = ?", businessID).
		Find(&missingLegals).Error; err != nil {
		return nil, err
	}

	// Get missing product legals with steps
	if err := s.DB.Preload("StepsToGetProductLegal").
		Joins("JOIN products ON products.id = missing_product_legals.product_id").
		Where("products.business_id = ?", businessID).
		Find(&missingProductLegals).Error; err != nil {
		return nil, err
	}

	// Get products for mapping
	if err := s.DB.Where("business_id = ?", businessID).Find(&products).Error; err != nil {
		return nil, err
	}

	// If literally nothing found
	if len(existingLegals) == 0 && len(existingProductLegals) == 0 &&
		len(missingLegals) == 0 && len(missingProductLegals) == 0 {
		return nil, gorm.ErrRecordNotFound
	}

	comparison := &models.LegalComparison{
		Required: make([]models.BusinessLegalRequirement, 0),
		Products: make([]models.ProductLegalComparison, 0),
	}

	// Map existing business legals
	for _, legal := range existingLegals {
		comparison.Required = append(comparison.Required, models.BusinessLegalRequirement{
			Type:     legal.LegalType,
			HasLegal: true,
			Notes:    legal.Notes,
		})
	}

	// Map missing business legals
	for _, legal := range missingLegals {
		steps := make([]models.LegalAcquisitionStep, len(legal.StepsToGetLegal))
		for i, step := range legal.StepsToGetLegal {
			steps[i] = models.LegalAcquisitionStep{
				StepNumber:  step.StepNumber,
				Description: step.Description,
				RedirectURL: step.RedirectURL,
			}
		}
		comparison.Required = append(comparison.Required, models.BusinessLegalRequirement{
			Type:     legal.LegalType,
			HasLegal: false,
			Notes:    legal.Notes,
			Steps:    steps,
		})
	}

	// Build product legal map
	productMap := make(map[uint][]models.ProductLegalRequirement)

	// Add existing product legals
	for _, prodLegal := range existingProductLegals {
		req := models.ProductLegalRequirement{
			Type:     prodLegal.LegalType,
			HasLegal: true,
			Notes:    prodLegal.Notes,
		}
		productMap[prodLegal.ProductID] = append(productMap[prodLegal.ProductID], req)
	}

	// Add missing product legals
	for _, prodLegal := range missingProductLegals {
		steps := make([]models.LegalAcquisitionStep, len(prodLegal.StepsToGetProductLegal))
		for i, step := range prodLegal.StepsToGetProductLegal {
			steps[i] = models.LegalAcquisitionStep{
				StepNumber:  step.StepNumber,
				Description: step.Description,
				RedirectURL: step.RedirectURL,
			}
		}
		req := models.ProductLegalRequirement{
			Type:     prodLegal.LegalType,
			HasLegal: false,
			Notes:    prodLegal.Notes,
			Steps:    steps,
		}
		productMap[prodLegal.ProductID] = append(productMap[prodLegal.ProductID], req)
	}

	// Build product comparisons
	for _, product := range products {
		comparison.Products = append(comparison.Products, models.ProductLegalComparison{
			ProductName: product.Name,
			Required:    productMap[product.ID],
		})
	}

	return comparison, nil
}


// ClearStoredLegalAnalysis removes existing analysis data
func (s *BusinessService) ClearStoredLegalAnalysis(businessID uint) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		// Clear business legals
		if err := tx.Where("business_id = ?", businessID).Delete(&models.MissingLegal{}).Error; err != nil {
			return err
		}

		// Clear product legals
		if err := tx.Where("product_id IN (SELECT id FROM products WHERE business_id = ?)", businessID).
			Delete(&models.MissingProductLegal{}).Error; err != nil {
			return err
		}

		return nil
	})
}

// type LegalComparison struct {
// 	Required []struct {
// 		Type     string                  `json:"type"`
// 		HasLegal bool                    `json:"has_legal"`
// 		Notes    string                  `json:"notes,omitempty"`
// 		Steps    []models.StepToGetLegal `json:"steps,omitempty"`
// 	} `json:"required"`
// 	Products []struct {
// 		ProductName string `json:"product_name"`
// 		Required    []struct {
// 			Type     string                  `json:"type"`
// 			HasLegal bool                    `json:"has_legal"`
// 			Notes    string                  `json:"notes,omitempty"`
// 			Steps    []models.StepToGetLegal `json:"steps,omitempty"`
// 		} `json:"required"`
// 	} `json:"products"`
// }

// func (s *BusinessService) GetLegalComparison(businessID uint) (*models.LegalComparison, error) {
// 	comparison := &models.LegalComparison{}

// 	// Get existing legals
// 	existingLegals := make(map[string]bool)
// 	var legals []models.Legal
// 	if err := s.DB.Where("business_id = ?", businessID).Find(&legals).Error; err != nil {
// 		return nil, err
// 	}
// 	for _, l := range legals {
// 		existingLegals[l.LegalType] = true
// 	}

// 	// Get missing legals with steps
// 	var missingLegals []models.MissingLegal
// 	if err := s.DB.Preload("Steps").Where("business_id = ?", businessID).Find(&missingLegals).Error; err != nil {
// 		return nil, err
// 	}

// 	// Compare and build required list
// 	for _, ml := range missingLegals {
// 		comparison.Required = append(comparison.Required, struct {
// 			Type     string                  `json:"type"`
// 			HasLegal bool                    `json:"has_legal"`
// 			Notes    string                  `json:"notes,omitempty"`
// 			Steps    []models.StepToGetLegal `json:"steps,omitempty"`
// 		}{
// 			Type:     ml.LegalType,
// 			HasLegal: existingLegals[ml.LegalType],
// 			Notes:    ml.Notes,
// 			Steps:    []models.StepToGetLegal{},
// 		})
// 	}

// 	// Get products comparison
// 	var products []models.Product
// 	if err := s.DB.Where("business_id = ?", businessID).Find(&products).Error; err != nil {
// 		return nil, err
// 	}

// 	for _, prod := range products {
// 		productComparison := struct {
// 			ProductName string `json:"product_name"`
// 			Required    []struct {
// 				Type     string                  `json:"type"`
// 				HasLegal bool                    `json:"has_legal"`
// 				Notes    string                  `json:"notes,omitempty"`
// 				Steps    []models.StepToGetLegal `json:"steps,omitempty"`
// 			} `json:"required"`
// 		}{
// 			ProductName: prod.Name,
// 		}

// 		// Get existing product legals
// 		existingProdLegals := make(map[string]bool)
// 		var prodLegals []models.ProductLegal
// 		if err := s.DB.Where("product_id = ?", prod.ID).Find(&prodLegals).Error; err != nil {
// 			return nil, err
// 		}
// 		for _, l := range prodLegals {
// 			existingProdLegals[l.LegalType] = true
// 		}

// 		// Get missing product legals
// 		var missingProdLegals []models.MissingProductLegal
// 		if err := s.DB.Preload("Steps").Where("product_id = ?", prod.ID).Find(&missingProdLegals).Error; err != nil {
// 			return nil, err
// 		}

// 		for _, mpl := range missingProdLegals {
// 			productComparison.Required = append(productComparison.Required, struct {
// 				Type     string                  `json:"type"`
// 				HasLegal bool                    `json:"has_legal"`
// 				Notes    string                  `json:"notes,omitempty"`
// 				Steps    []models.StepToGetLegal `json:"steps,omitempty"`
// 			}{
// 				Type:     mpl.LegalType,
// 				HasLegal: existingProdLegals[mpl.LegalType],
// 				Notes:    mpl.Notes,
// 				Steps:    []models.StepToGetLegal{},
// 			})
// 		}

// 		comparison.Products = append(comparison.Products, productComparison)
// 	}

// 	return comparison, nil
// }
