package services

import (
	"go-gin-backend/internal/models"

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
