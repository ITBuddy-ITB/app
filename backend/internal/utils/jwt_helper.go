package utils

import (
	"errors"
	"os"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func GetUserIDFromContext(c *gin.Context) (uint, error) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		return 0, errors.New("missing authorization header")
	}

	// Remove Bearer prefix if present
	if after, ok := strings.CutPrefix(tokenString, "Bearer "); ok {
		tokenString = after
	}

	// Load secret from environment
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))

	// Parse JWT
	claims := &jwt.StandardClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return 0, errors.New("invalid token")
	}

	// Convert subject (sub) => userID
	userID, err := strconv.ParseUint(claims.Subject, 10, 32)
	if err != nil {
		return 0, errors.New("invalid user ID in token")
	}

	return uint(userID), nil
}
