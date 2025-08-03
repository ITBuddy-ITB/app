package services

import (
	"go-gin-backend/internal/models"

	"gorm.io/gorm"
)

type InvestmentService struct {
	DB *gorm.DB
}

func NewInvestmentService(db *gorm.DB) *InvestmentService {
	return &InvestmentService{DB: db}
}

func (s *InvestmentService) CreateInvestment(investment *models.Investment) error {
	return s.DB.Create(investment).Error
}

func (s *InvestmentService) GetInvestmentByID(id uint) (*models.Investment, error) {
	var investment models.Investment
	if err := s.DB.First(&investment, id).Error; err != nil {
		return nil, err
	}
	return &investment, nil
}

func (s *InvestmentService) GetAllInvestments() ([]models.Investment, error) {
	var investments []models.Investment
	if err := s.DB.Find(&investments).Error; err != nil {
		return nil, err
	}
	return investments, nil
}

func (s *InvestmentService) GetInvestmentsByInvestorID(investorID uint) ([]models.Investment, error) {
	var investments []models.Investment
	if err := s.DB.Where("investor_id = ?", investorID).Find(&investments).Error; err != nil {
		return nil, err
	}
	return investments, nil
}

func (s *InvestmentService) GetInvestmentsByBusinessID(businessID uint) ([]models.Investment, error) {
	var investments []models.Investment
	if err := s.DB.Where("business_id = ?", businessID).Find(&investments).Error; err != nil {
		return nil, err
	}
	return investments, nil
}

func (s *InvestmentService) GetUserInvestmentsForBusiness(investorID uint, businessID uint) ([]models.Investment, error) {
	var investments []models.Investment
	if err := s.DB.Where("investor_id = ? AND business_id = ?", investorID, businessID).Find(&investments).Error; err != nil {
		return nil, err
	}
	return investments, nil
}

func (s *InvestmentService) UpdateInvestment(investment *models.Investment) error {
	return s.DB.Save(investment).Error
}

func (s *InvestmentService) DeleteInvestment(id uint) error {
	return s.DB.Delete(&models.Investment{}, id).Error
}
