#!/bin/bash

# =============================================================================
# Family Organizer - Multi-Architecture Build Script
# Use this to build images for both x86 and ARM (Raspberry Pi) from any machine
# Requires Docker Buildx
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
IMAGE_NAME="family-organizer"
IMAGE_TAG="${1:-latest}"
PLATFORMS="linux/amd64,linux/arm64,linux/arm/v7"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Multi-Architecture Build             ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Image: ${YELLOW}${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo -e "Platforms: ${YELLOW}${PLATFORMS}${NC}"
echo ""

# Check if buildx is available
if ! docker buildx version &> /dev/null; then
    echo -e "${RED}Error: Docker Buildx is not available.${NC}"
    echo "Please install Docker Desktop or enable buildx in Docker."
    exit 1
fi

# Create builder if it doesn't exist
BUILDER_NAME="family-builder"
if ! docker buildx inspect ${BUILDER_NAME} &> /dev/null; then
    echo -e "${YELLOW}Creating buildx builder...${NC}"
    docker buildx create --name ${BUILDER_NAME} --use
    docker buildx inspect --bootstrap
fi

# Use the builder
docker buildx use ${BUILDER_NAME}

echo -e "${YELLOW}Building for multiple architectures...${NC}"
echo "This may take a while..."
echo ""

# Build and push (or load for local use)
# Remove --push if you don't want to push to a registry
# Add --load to load into local Docker (only works for single platform)
docker buildx build \
    --platform ${PLATFORMS} \
    --tag ${IMAGE_NAME}:${IMAGE_TAG} \
    --file Dockerfile \
    . \
    --load 2>/dev/null || \
docker buildx build \
    --platform linux/arm64 \
    --tag ${IMAGE_NAME}:${IMAGE_TAG} \
    --file Dockerfile \
    . \
    --load

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Build Complete!                      ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "To save the image for transfer to Pi:"
echo -e "  ${YELLOW}docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > family-organizer.tar.gz${NC}"
echo ""
echo -e "Then on the Pi:"
echo -e "  ${YELLOW}gunzip -c family-organizer.tar.gz | docker load${NC}"
echo -e "  ${YELLOW}docker-compose up -d${NC}"
echo ""
