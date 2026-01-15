#!/bin/bash

# =============================================================================
# Family Organizer - Build and Deploy Script
# Run this script on your Raspberry Pi to build and start the app
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Family Organizer - Build & Deploy    ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Install Docker first: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed.${NC}"
    echo "Install Docker Compose: sudo apt-get install docker-compose"
    exit 1
fi

# Determine which compose command to use
if docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${YELLOW}Step 1: Stopping existing containers...${NC}"
$COMPOSE_CMD down --remove-orphans 2>/dev/null || true
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 2: Building the application...${NC}"
echo "This may take a few minutes on Raspberry Pi..."
$COMPOSE_CMD build --no-cache
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

echo -e "${YELLOW}Step 3: Starting the application...${NC}"
$COMPOSE_CMD up -d
echo -e "${GREEN}✓ Application started${NC}"
echo ""

# Wait for container to be healthy
echo -e "${YELLOW}Step 4: Waiting for health check...${NC}"
sleep 5

# Check if container is running
if $COMPOSE_CMD ps | grep -q "family-organizer.*Up"; then
    echo -e "${GREEN}✓ Container is running${NC}"
else
    echo -e "${RED}✗ Container failed to start${NC}"
    echo "Check logs with: $COMPOSE_CMD logs"
    exit 1
fi

# Get the IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!                 ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Access the app at:"
echo -e "  - Local:   ${GREEN}http://localhost${NC}"
echo -e "  - Network: ${GREEN}http://${IP_ADDRESS}${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  - View logs:     ${YELLOW}$COMPOSE_CMD logs -f${NC}"
echo -e "  - Stop app:      ${YELLOW}$COMPOSE_CMD down${NC}"
echo -e "  - Restart app:   ${YELLOW}$COMPOSE_CMD restart${NC}"
echo -e "  - Check status:  ${YELLOW}$COMPOSE_CMD ps${NC}"
echo ""
