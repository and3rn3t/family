#!/bin/bash

# =============================================================================
# Family Organizer - Create Raspberry Pi Deployment Package
# Creates a complete package with Docker image + deployment files
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

VERSION="${1:-1.0.0}"
PACKAGE_DIR="family-organizer-pi-package"
PACKAGE_FILE="family-organizer-pi-${VERSION}.zip"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🏠 Family Organizer - Pi Deployment Package Creator     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Clean up previous package
rm -rf ${PACKAGE_DIR}
rm -f ${PACKAGE_FILE}

# Create package directory
mkdir -p ${PACKAGE_DIR}

echo -e "${YELLOW}📦 Creating deployment package...${NC}"

# Copy necessary files
cp docker-compose.yml ${PACKAGE_DIR}/
cp nginx.conf ${PACKAGE_DIR}/

# Create Pi-specific docker-compose
cat > ${PACKAGE_DIR}/docker-compose.yml << 'EOF'
# =============================================================================
# Family Organizer - Raspberry Pi Docker Compose
# =============================================================================

services:
  family-organizer:
    image: family-organizer:latest
    container_name: family-organizer
    ports:
      - "80:80"
    restart: unless-stopped
    
    # Resource limits for Pi
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 64M
    
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 30s
    
    logging:
      driver: "json-file"
      options:
        max-size: "5m"
        max-file: "2"
EOF

# Create install script
cat > ${PACKAGE_DIR}/install.sh << 'EOF'
#!/bin/bash

# Family Organizer - Raspberry Pi Install Script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${GREEN}🏠 Family Organizer - Installation${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed! You may need to log out and back in.${NC}"
fi

# Load the image
if [ -f "family-organizer.tar.gz" ]; then
    echo -e "${YELLOW}Loading Docker image...${NC}"
    gunzip -c family-organizer.tar.gz | docker load
    echo -e "${GREEN}✅ Image loaded${NC}"
else
    echo -e "${RED}❌ family-organizer.tar.gz not found${NC}"
    echo "Please copy the image file to this directory"
    exit 1
fi

# Start the container
echo -e "${YELLOW}Starting Family Organizer...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ Installation Complete!             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Get IP address
IP=$(hostname -I | awk '{print $1}')
echo -e "Open in browser: ${YELLOW}http://${IP}${NC}"
echo ""
echo "Commands:"
echo "  View logs:    docker logs family-organizer"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo ""
EOF
chmod +x ${PACKAGE_DIR}/install.sh

# Create uninstall script
cat > ${PACKAGE_DIR}/uninstall.sh << 'EOF'
#!/bin/bash

echo "Stopping Family Organizer..."
docker-compose down

echo "Removing image..."
docker rmi family-organizer:latest 2>/dev/null || true

echo "Done! Family Organizer has been removed."
EOF
chmod +x ${PACKAGE_DIR}/uninstall.sh

# Create kiosk setup script
cat > ${PACKAGE_DIR}/setup-kiosk.sh << 'EOF'
#!/bin/bash

# Family Organizer - Kiosk Mode Setup
# Makes the Pi boot directly into the Family Organizer display

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${GREEN}🖥️  Setting up Kiosk Mode${NC}"
echo ""

# Install required packages
sudo apt-get update
sudo apt-get install -y chromium-browser unclutter xdotool

# Create autostart directory
mkdir -p ~/.config/autostart

# Create kiosk script
cat > ~/kiosk.sh << 'KIOSK'
#!/bin/bash

# Wait for network and Docker
sleep 10

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide cursor after 3 seconds
unclutter -idle 3 &

# Get local IP
IP=$(hostname -I | awk '{print $1}')

# Start Chromium in kiosk mode
chromium-browser \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --no-first-run \
    --start-fullscreen \
    "http://localhost"
KIOSK
chmod +x ~/kiosk.sh

# Create autostart entry
cat > ~/.config/autostart/kiosk.desktop << 'DESKTOP'
[Desktop Entry]
Type=Application
Name=Family Organizer Kiosk
Exec=/home/pi/kiosk.sh
X-GNOME-Autostart-enabled=true
DESKTOP

echo ""
echo -e "${GREEN}✅ Kiosk mode configured!${NC}"
echo ""
echo "The Pi will now boot directly into Family Organizer."
echo "To exit kiosk mode: Press Alt+F4 or connect via SSH"
echo ""
echo "Reboot to test: sudo reboot"
echo ""
EOF
chmod +x ${PACKAGE_DIR}/setup-kiosk.sh

# Create README
cat > ${PACKAGE_DIR}/README.txt << 'EOF'
═══════════════════════════════════════════════════════════════════
  🏠 Family Organizer - Raspberry Pi Deployment Package
═══════════════════════════════════════════════════════════════════

QUICK START
-----------
1. Copy this folder and family-organizer.tar.gz to your Pi
2. Run: ./install.sh
3. Open browser to http://<pi-ip-address>

FILES
-----
• install.sh       - Install and start the app
• uninstall.sh     - Remove the app
• setup-kiosk.sh   - Configure Pi to boot into app (optional)
• docker-compose.yml - Docker configuration

REQUIREMENTS
------------
• Raspberry Pi 3B+, 4, or 5
• Raspberry Pi OS (64-bit recommended)
• Docker (auto-installed by install.sh if missing)
• At least 512MB free RAM

KIOSK MODE (Optional)
---------------------
To make the Pi boot directly into Family Organizer:
  ./setup-kiosk.sh
  sudo reboot

TROUBLESHOOTING
---------------
• Check status:  docker ps
• View logs:     docker logs family-organizer
• Restart:       docker-compose restart
• Check memory:  free -h

SUPPORT
-------
GitHub: https://github.com/your-repo/family-organizer

═══════════════════════════════════════════════════════════════════
EOF

# Now build the Docker image
echo -e "${YELLOW}🏗️  Building Docker image for ARM64...${NC}"
echo "   This may take 5-10 minutes..."
echo ""

# Setup buildx
BUILDER_NAME="pi-builder"
if ! docker buildx inspect ${BUILDER_NAME} &> /dev/null; then
    docker buildx create --name ${BUILDER_NAME} --driver docker-container --use
    docker buildx inspect --bootstrap
else
    docker buildx use ${BUILDER_NAME}
fi

# Build the image
docker buildx build \
    --platform linux/arm64 \
    --tag family-organizer:latest \
    --tag family-organizer:${VERSION} \
    --file Dockerfile \
    --output type=docker,dest=- \
    . | gzip > ${PACKAGE_DIR}/family-organizer.tar.gz

# Create the zip package
echo ""
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
zip -r ${PACKAGE_FILE} ${PACKAGE_DIR}

# Get sizes
IMAGE_SIZE=$(ls -lh ${PACKAGE_DIR}/family-organizer.tar.gz | awk '{print $5}')
PACKAGE_SIZE=$(ls -lh ${PACKAGE_FILE} | awk '{print $5}')

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                 ✅ Package Created!                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📦 Package:     ${YELLOW}${PACKAGE_FILE}${NC} (${PACKAGE_SIZE})"
echo -e "🐳 Docker Image: ${IMAGE_SIZE}"
echo ""
echo -e "${BLUE}To deploy:${NC}"
echo ""
echo -e "  1. Copy to your Pi:"
echo -e "     ${YELLOW}scp ${PACKAGE_FILE} pi@<pi-ip>:~/${NC}"
echo ""
echo -e "  2. On the Pi:"
echo -e "     ${YELLOW}unzip ${PACKAGE_FILE}${NC}"
echo -e "     ${YELLOW}cd ${PACKAGE_DIR}${NC}"
echo -e "     ${YELLOW}./install.sh${NC}"
echo ""

# Cleanup
rm -rf ${PACKAGE_DIR}
