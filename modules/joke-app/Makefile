# =============================================================================
# Joke Web Application Makefile (React + Express.js + SQLite)
# =============================================================================

# Project configuration
PROJECT_NAME := joke-app
FRONTEND_DIR := frontend
BACKEND_DIR := backend
BUILD_DIR := ../output

# Node.js/npm commands
NPM := npm
NODE := node

# =============================================================================
# Build Targets
# =============================================================================

.PHONY: all setup dev build test clean help dev-frontend dev-backend build-frontend build-backend start install

# Default target
all: setup build

# Setup - install all dependencies
setup:
	@echo "Installing all dependencies..."
	$(NPM) run install:all
	@echo "Setup complete!"

# Development - run both frontend and backend
dev:
	@echo "Starting development servers..."
	$(NPM) run dev

# Build - compile both frontend and backend
build:
	@echo "Building $(PROJECT_NAME)..."
	$(NPM) run build
	@echo "Build complete!"

# Test - run all tests  
test:
	@echo "Running tests for $(PROJECT_NAME)..."
	$(NPM) run test
	@echo "Tests complete!"

# Clean - remove build artifacts and node_modules
clean:
	@echo "Cleaning $(PROJECT_NAME)..."
	$(NPM) run clean
	@echo "Clean complete!"

# Frontend specific targets
dev-frontend:
	@echo "Starting frontend development server..."
	$(NPM) run dev:frontend

build-frontend:
	@echo "Building frontend..."
	$(NPM) run build:frontend

# Backend specific targets
dev-backend:
	@echo "Starting backend development server..."
	$(NPM) run dev:backend

build-backend:
	@echo "Building backend..."
	$(NPM) run build:backend

# Production start
start: build
	@echo "Starting production server..."
	$(NPM) start

# Install (copy built files to parent output directory)
install: build
	@echo "Installing built artifacts to output directory..."
	mkdir -p $(BUILD_DIR)/release
	cp -r $(FRONTEND_DIR)/dist $(BUILD_DIR)/release/frontend 2>/dev/null || true
	cp -r $(BACKEND_DIR)/dist $(BUILD_DIR)/release/backend 2>/dev/null || true
	@echo "Installation complete!"

# Help
help:
	@echo "$(PROJECT_NAME) Build System"
	@echo ""
	@echo "Targets:"
	@echo "  setup          - Install all dependencies" 
	@echo "  dev            - Start development servers (frontend + backend)"
	@echo "  build          - Build production version"
	@echo "  test           - Run all tests"
	@echo "  clean          - Remove build artifacts"
	@echo "  dev-frontend   - Start only frontend dev server"
	@echo "  dev-backend    - Start only backend dev server"  
	@echo "  start          - Start production server"
	@echo "  install        - Copy built files to output directory"
	@echo "  help           - Show this help"
