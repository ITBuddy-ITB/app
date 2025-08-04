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
		Preload("Financial").
		Preload("Legals").
		Where("user_id = ?", userID).
		Find(&businesses).Error; err != nil {
		return nil, err
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
		Preload("Financial").
		First(&business, id).Error; err != nil {
		return nil, err
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

func (s *BusinessService) StoreLegalAnalysis(businessID uint, analysis *BusinessLegalAnalysis) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		// Store business legals
		for _, legal := range analysis.BusinessLegals {
			missingLegal := &models.MissingLegal{
				BusinessID: businessID,
				LegalType:  legal.LegalType,
				Notes:      legal.Notes,
			}
			if err := tx.Create(missingLegal).Error; err != nil {
				return err
			}

			// Store steps for this legal
			for _, step := range legal.Steps {
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

		// Store product legals
		for _, prodLegal := range analysis.ProductLegals {
			// Find product by name
			var product models.Product
			if err := tx.Where("business_id = ? AND name LIKE ?", businessID, "%"+prodLegal.ProductName+"%").
				First(&product).Error; err != nil {
				continue // Skip if product not found
			}

			missingLegal := &models.MissingProductLegal{
				ProductID: product.ID,
				LegalType: prodLegal.LegalType,
				Notes:     prodLegal.Notes,
			}
			if err := tx.Create(missingLegal).Error; err != nil {
				return err
			}

			// Store steps for this product legal
			for _, step := range prodLegal.Steps {
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

		return nil
	})
}

type LegalComparison struct {
	Required []struct {
		Type     string                  `json:"type"`
		HasLegal bool                    `json:"has_legal"`
		Notes    string                  `json:"notes,omitempty"`
		Steps    []models.StepToGetLegal `json:"steps,omitempty"`
	} `json:"required"`
	Products []struct {
		ProductName string `json:"product_name"`
		Required    []struct {
			Type     string                  `json:"type"`
			HasLegal bool                    `json:"has_legal"`
			Notes    string                  `json:"notes,omitempty"`
			Steps    []models.StepToGetLegal `json:"steps,omitempty"`
		} `json:"required"`
	} `json:"products"`
}

func (s *BusinessService) GetLegalComparison(businessID uint) (*LegalComparison, error) {
	comparison := &LegalComparison{}

	// Get existing legals
	existingLegals := make(map[string]bool)
	var legals []models.Legal
	if err := s.DB.Where("business_id = ?", businessID).Find(&legals).Error; err != nil {
		return nil, err
	}
	for _, l := range legals {
		existingLegals[l.LegalType] = true
	}

	// Get missing legals with steps
	var missingLegals []models.MissingLegal
	if err := s.DB.Preload("Steps").Where("business_id = ?", businessID).Find(&missingLegals).Error; err != nil {
		return nil, err
	}

	// Compare and build required list
	for _, ml := range missingLegals {
		comparison.Required = append(comparison.Required, struct {
			Type     string                  `json:"type"`
			HasLegal bool                    `json:"has_legal"`
			Notes    string                  `json:"notes,omitempty"`
			Steps    []models.StepToGetLegal `json:"steps,omitempty"`
		}{
			Type:     ml.LegalType,
			HasLegal: existingLegals[ml.LegalType],
			Notes:    ml.Notes,
			Steps:    []models.StepToGetLegal{},
		})
	}

	// Get products comparison
	var products []models.Product
	if err := s.DB.Where("business_id = ?", businessID).Find(&products).Error; err != nil {
		return nil, err
	}

	for _, prod := range products {
		productComparison := struct {
			ProductName string `json:"product_name"`
			Required    []struct {
				Type     string                  `json:"type"`
				HasLegal bool                    `json:"has_legal"`
				Notes    string                  `json:"notes,omitempty"`
				Steps    []models.StepToGetLegal `json:"steps,omitempty"`
			} `json:"required"`
		}{
			ProductName: prod.Name,
		}

		// Get existing product legals
		existingProdLegals := make(map[string]bool)
		var prodLegals []models.ProductLegal
		if err := s.DB.Where("product_id = ?", prod.ID).Find(&prodLegals).Error; err != nil {
			return nil, err
		}
		for _, l := range prodLegals {
			existingProdLegals[l.LegalType] = true
		}

		// Get missing product legals
		var missingProdLegals []models.MissingProductLegal
		if err := s.DB.Preload("Steps").Where("product_id = ?", prod.ID).Find(&missingProdLegals).Error; err != nil {
			return nil, err
		}

		for _, mpl := range missingProdLegals {
			productComparison.Required = append(productComparison.Required, struct {
				Type     string                  `json:"type"`
				HasLegal bool                    `json:"has_legal"`
				Notes    string                  `json:"notes,omitempty"`
				Steps    []models.StepToGetLegal `json:"steps,omitempty"`
			}{
				Type:     mpl.LegalType,
				HasLegal: existingProdLegals[mpl.LegalType],
				Notes:    mpl.Notes,
				Steps:    []models.StepToGetLegal{},
			})
		}

		comparison.Products = append(comparison.Products, productComparison)
	}

	return comparison, nil
}
