package services

import (
	"errors"
	"go-gin-backend/internal/models"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserService *UserService
	JWTSecret   []byte
}

func NewAuthService(userService *UserService, jwtSecret string) *AuthService {
	return &AuthService{
		UserService: userService,
		JWTSecret:   []byte(jwtSecret),
	}
}

func (s *AuthService) Register(username, password, email string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username: username,
		Password: string(hashedPassword),
		Email:    email,
	}

	err = s.UserService.CreateUser(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(username, password string) (string, error) {
	user, err := s.UserService.GetUserByUsername(username)
	if err != nil {
		return "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *AuthService) GenerateToken(userID uint) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.StandardClaims{
		Subject:   strconv.FormatUint(uint64(userID), 10),
		ExpiresAt: expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.JWTSecret)
}
