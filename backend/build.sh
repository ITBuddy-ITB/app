#!/bin/bash

# Go Gin Backend Build Script
echo "🔨 Building Go Gin Backend..."

# Set build variables
APP_NAME="server"
BUILD_DIR="bin"
CMD_DIR="cmd/server"

# Create build directory if it doesn't exist
mkdir -p $BUILD_DIR

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -f $BUILD_DIR/$APP_NAME
rm -f $BUILD_DIR/$APP_NAME.exe

# Format code
echo "📝 Formatting code..."
go fmt ./...

# Run tests
echo "🧪 Running tests..."
go test ./...

# Check for any linting issues
echo "🔍 Running go vet..."
go vet ./...

# Build the application
echo "🏗️  Building application..."
CGO_ENABLED=0 go build -ldflags="-w -s" -o $BUILD_DIR/$APP_NAME ./$CMD_DIR

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Binary created at $BUILD_DIR/$APP_NAME"
    echo "📁 Binary size: $(du -h $BUILD_DIR/$APP_NAME | cut -f1)"
else
    echo "❌ Build failed!"
    exit 1
fi

# Make the binary executable
chmod +x $BUILD_DIR/$APP_NAME

echo "🚀 Ready to run! Use: ./$BUILD_DIR/$APP_NAME"
