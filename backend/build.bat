@echo off
REM Go Gin Backend Build Script for Windows
echo 🔨 Building Go Gin Backend...

REM Set build variables
set APP_NAME=server
set BUILD_DIR=bin
set CMD_DIR=cmd/server

REM Create build directory if it doesn't exist
if not exist %BUILD_DIR% mkdir %BUILD_DIR%

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist %BUILD_DIR%\%APP_NAME%.exe del %BUILD_DIR%\%APP_NAME%.exe
if exist %BUILD_DIR%\%APP_NAME% del %BUILD_DIR%\%APP_NAME%

REM Format code
echo 📝 Formatting code...
go fmt ./...

REM Run tests
echo 🧪 Running tests...
go test ./...
if errorlevel 1 (
    echo ❌ Tests failed!
    pause
    exit /b 1
)

REM Check for any linting issues
echo 🔍 Running go vet...
go vet ./...
if errorlevel 1 (
    echo ❌ Vet check failed!
    pause
    exit /b 1
)

REM Build the application
echo 🏗️  Building application...
set CGO_ENABLED=0
go build -ldflags="-w -s" -o %BUILD_DIR%\%APP_NAME%.exe .\%CMD_DIR%

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
) else (
    echo ✅ Build successful! Binary created at %BUILD_DIR%\%APP_NAME%.exe
    for %%A in (%BUILD_DIR%\%APP_NAME%.exe) do echo 📁 Binary size: %%~zA bytes
)

echo 🚀 Ready to run! Use: %BUILD_DIR%\%APP_NAME%.exe
pause
