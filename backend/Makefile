# Go Gin Backend Makefile

# Variables
APP_NAME := server
BUILD_DIR := bin
CMD_DIR := cmd/server
LDFLAGS := -w -s

# Default target
.PHONY: all
all: clean fmt vet test build

# Clean build artifacts
.PHONY: clean
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)
	@mkdir -p $(BUILD_DIR)

# Format code
.PHONY: fmt
fmt:
	@echo "📝 Formatting code..."
	@go fmt ./...

# Vet code
.PHONY: vet
vet:
	@echo "🔍 Running go vet..."
	@go vet ./...

# Run tests
.PHONY: test
test:
	@echo "🧪 Running tests..."
	@go test -v ./...

# Build application
.PHONY: build
build:
	@echo "🏗️  Building application..."
	@CGO_ENABLED=0 go build -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME) ./$(CMD_DIR)
	@echo "✅ Build successful! Binary created at $(BUILD_DIR)/$(APP_NAME)"

# Build for Linux
.PHONY: build-linux
build-linux:
	@echo "🐧 Building for Linux..."
	@CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME)-linux ./$(CMD_DIR)

# Build for Windows
.PHONY: build-windows
build-windows:
	@echo "🪟 Building for Windows..."
	@CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME)-windows.exe ./$(CMD_DIR)

# Build for macOS
.PHONY: build-darwin
build-darwin:
	@echo "🍎 Building for macOS..."
	@CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME)-darwin ./$(CMD_DIR)

# Build for all platforms
.PHONY: build-all
build-all: build-linux build-windows build-darwin
	@echo "🌍 Built for all platforms!"

# Run the application
.PHONY: run
run: build
	@echo "🚀 Running application..."
	@./$(BUILD_DIR)/$(APP_NAME)

# Run with live reload (requires air)
.PHONY: dev
dev:
	@echo "🔄 Starting development server with live reload..."
	@air

# Install dependencies
.PHONY: deps
deps:
	@echo "📦 Installing dependencies..."
	@go mod download
	@go mod tidy

# Install development tools
.PHONY: tools
tools:
	@echo "🔧 Installing development tools..."
	@go install github.com/cosmtrek/air@latest

# Generate documentation
.PHONY: docs
docs:
	@echo "📚 Generating documentation..."
	@go doc -all ./...

# Security check
.PHONY: security
security:
	@echo "🔒 Running security checks..."
	@go list -json -m all | nancy sleuth

# Database migration
.PHONY: migrate
migrate:
	@echo "🗃️  Running database migrations..."
	@go run ./$(CMD_DIR) -migrate

# Show help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all          - Run clean, fmt, vet, test, and build"
	@echo "  clean        - Clean build artifacts"
	@echo "  fmt          - Format code"
	@echo "  vet          - Run go vet"
	@echo "  test         - Run tests"
	@echo "  build        - Build application"
	@echo "  build-linux  - Build for Linux"
	@echo "  build-windows- Build for Windows"
	@echo "  build-darwin - Build for macOS"
	@echo "  build-all    - Build for all platforms"
	@echo "  run          - Build and run application"
	@echo "  dev          - Start development server with live reload"
	@echo "  deps         - Install dependencies"
	@echo "  tools        - Install development tools"
	@echo "  docs         - Generate documentation"
	@echo "  security     - Run security checks"
	@echo "  migrate      - Run database migrations"
	@echo "  help         - Show this help message"
