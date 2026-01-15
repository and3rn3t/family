#!/bin/bash

# =============================================================================
# Family Organizer - Build for Raspberry Pi
# Creates a Docker image that can be loaded directly on a Raspberry Pi
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
IMAGE_NAME="family-organizer"
VERSION="${1:-latest}"
OUTPUT_FILE="family-organizer-pi-${VERSION}.tar.gz"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       🏠 Family Organizer - Raspberry Pi Build              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if buildx is available
if ! docker buildx version &> /dev/null; then
    echo -e "${RED}❌ Docker Buildx is not available${NC}"
    echo "Install Docker Desktop or enable buildx"
    exit 1
fi

# Setup buildx builder
BUILDER_NAME="pi-builder"
echo -e "${YELLOW}🔧 Setting up build environment...${NC}"

if ! docker buildx inspect ${BUILDER_NAME} &> /dev/null; then
    docker buildx create --name ${BUILDER_NAME} --driver docker-container --use
    docker buildx inspect --bootstrap
else
    docker buildx use ${BUILDER_NAME}
fi

echo ""
echo -e "${YELLOW}🏗️  Building for Raspberry Pi (ARM64)...${NC}"
echo -e "   This may take 5-10 minutes..."
echo ""

# Build for ARM64 (Pi 3B+, Pi 4, Pi 5)
docker buildx build \
    --platform linux/arm64 \
    --tag ${IMAGE_NAME}:${VERSION} \
    --tag ${IMAGE_NAME}:latest \
    --file Dockerfile \
    --output type=docker,dest=- \
    . | gzip > ${OUTPUT_FILE}

# Get file size
FILE_SIZE=$(ls -lh ${OUTPUT_FILE} | awk '{print $5}')

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✅ Build Complete!                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📦 Output: ${YELLOW}${OUTPUT_FILE}${NC} (${FILE_SIZE})"
echo ""
echo -e "${BLUE}To deploy to your Raspberry Pi:${NC}"
echo ""
echo -e "  1. Copy the image to your Pi:"
echo -e "     ${YELLOW}scp ${OUTPUT_FILE} pi@<pi-ip>:~/${NC}"
echo ""
echo -e "  2. On the Pi, load the image:"
echo -e "     ${YELLOW}gunzip -c ${OUTPUT_FILE} | docker load${NC}"
echo ""
echo -e "  3. Run the container:"
echo -e "     ${YELLOW}docker run -d --name family-organizer -p 80:80 --restart unless-stopped ${IMAGE_NAME}:${VERSION}${NC}"
echo ""
echo -e "  Or use docker-compose:"
echo -e "     ${YELLOW}docker-compose up -d${NC}"
echo ""
