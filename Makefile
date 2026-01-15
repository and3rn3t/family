# =============================================================================
# Family Organizer - Makefile
# Convenience commands for development and deployment
# =============================================================================

.PHONY: help dev build preview lint format docker-build docker-up docker-down docker-logs docker-restart clean

# Default target
help:
	@echo "Family Organizer - Available Commands"
	@echo "======================================"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make preview    - Preview production build"
	@echo "  make lint       - Run ESLint"
	@echo "  make format     - Format code with Prettier"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-up      - Start container"
	@echo "  make docker-down    - Stop container"
	@echo "  make docker-logs    - View container logs"
	@echo "  make docker-restart - Restart container"
	@echo "  make docker-clean   - Remove images and containers"
	@echo ""
	@echo "Other:"
	@echo "  make clean      - Remove build artifacts"
	@echo ""

# Development
dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

format:
	npm run format

# Docker commands
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	docker-compose restart

docker-clean:
	docker-compose down --rmi all --volumes --remove-orphans

# Deploy (build and start)
deploy: docker-build docker-up
	@echo "Deployment complete!"

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/.cache/
