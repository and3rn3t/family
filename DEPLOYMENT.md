# Family Organizer - Deployment Guide

This guide covers deploying the Family Organizer app, with a focus on Raspberry Pi kiosk setups.

## Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Raspberry Pi Setup](#raspberry-pi-setup)
- [Kiosk Mode](#kiosk-mode)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/family-organizer.git
cd family-organizer

# Build and run
docker-compose up -d

# Access at http://localhost
```

### Using Make

```bash
make deploy    # Build and start
make docker-logs  # View logs
```

---

## Development

### Prerequisites

- Node.js 18+ 
- npm 9+

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Building for Production

```bash
npm run build
npm run preview  # Preview the build
```

---

## Docker Deployment

### Prerequisites

- Docker 20+
- Docker Compose v2+

### Building the Image

```bash
# Build the Docker image
docker-compose build

# Or with no cache (for fresh build)
docker-compose build --no-cache
```

### Running the Container

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Container Management

| Command | Description |
|---------|-------------|
| `docker-compose ps` | Check container status |
| `docker-compose restart` | Restart the container |
| `docker-compose logs -f` | Follow logs |
| `docker-compose down` | Stop and remove container |
| `docker-compose down -v` | Stop and remove volumes too |

### Health Check

The container includes a health check. Verify it's healthy:

```bash
docker-compose ps
# Should show "healthy" status

# Or check directly
curl http://localhost/health
```

---

## Raspberry Pi Setup

### Recommended Hardware

- Raspberry Pi 4 (2GB+ RAM recommended)
- MicroSD card (16GB+ recommended)
- Official Raspberry Pi OS (64-bit recommended)
- Display with HDMI connection

### Installing Docker on Raspberry Pi

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group (avoids needing sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install -y docker-compose

# Reboot to apply changes
sudo reboot
```

### Deploying to Raspberry Pi

#### Option 1: Build on the Pi (Simplest)

```bash
# Clone or copy files to Pi
git clone https://github.com/your-username/family-organizer.git
cd family-organizer

# Run the deploy script
chmod +x scripts/build-and-deploy.sh
./scripts/build-and-deploy.sh
```

#### Option 2: Build Elsewhere, Transfer to Pi

On your development machine:

```bash
# Build multi-arch image
./scripts/build-multiarch.sh

# Save image to file
docker save family-organizer:latest | gzip > family-organizer.tar.gz

# Transfer to Pi
scp family-organizer.tar.gz pi@raspberrypi.local:~
```

On the Raspberry Pi:

```bash
# Load the image
gunzip -c family-organizer.tar.gz | docker load

# Start with docker-compose
cd family-organizer
docker-compose up -d
```

### Network Access

Access the app from any device on your network:

1. Find Pi's IP address:
   ```bash
   hostname -I
   ```

2. Open in browser: `http://<pi-ip-address>`

3. For easier access, use mDNS: `http://raspberrypi.local`

---

## Kiosk Mode

Set up the Pi to boot directly into the Family Organizer app.

### 1. Install Required Packages

```bash
sudo apt-get install -y chromium-browser unclutter
```

### 2. Create Kiosk Script

```bash
nano ~/kiosk.sh
```

Add this content:

```bash
#!/bin/bash

# Wait for network
sleep 10

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide mouse cursor
unclutter -idle 0.5 -root &

# Start Chromium in kiosk mode
chromium-browser \
    --noerrdialogs \
    --disable-infobars \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --kiosk \
    --incognito \
    --check-for-update-interval=31536000 \
    http://localhost
```

Make it executable:

```bash
chmod +x ~/kiosk.sh
```

### 3. Auto-Start on Boot

Create autostart directory:

```bash
mkdir -p ~/.config/autostart
```

Create autostart entry:

```bash
nano ~/.config/autostart/kiosk.desktop
```

Add:

```ini
[Desktop Entry]
Type=Application
Name=Family Organizer Kiosk
Exec=/home/pi/kiosk.sh
X-GNOME-Autostart-enabled=true
```

### 4. Ensure Docker Starts on Boot

```bash
sudo systemctl enable docker
```

### 5. Reboot

```bash
sudo reboot
```

The Pi should boot directly into the Family Organizer app in full-screen kiosk mode.

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check if port 80 is in use
sudo lsof -i :80

# Try different port
# Edit docker-compose.yml: change "80:80" to "8080:80"
```

### Can't Access from Other Devices

```bash
# Check firewall
sudo ufw status

# Allow port 80
sudo ufw allow 80

# Verify Pi's IP
hostname -I
```

### Kiosk Mode Issues

```bash
# Check if Chromium is running
ps aux | grep chromium

# Test script manually
~/kiosk.sh

# Check X server logs
cat ~/.xsession-errors
```

### Build Fails on Pi

The build can be slow or fail on Pi due to limited RAM:

```bash
# Increase swap space temporarily
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change CONF_SWAPSIZE to 2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# Then rebuild
docker-compose build
```

### Container Uses Too Much Memory

Adjust limits in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 256M  # Reduce if needed
```

---

## Useful Commands Reference

```bash
# Docker
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
docker-compose ps             # Status

# System (on Pi)
hostname -I                   # Get IP address
df -h                         # Check disk space
free -h                       # Check memory
htop                          # System monitor

# Kiosk
pkill chromium                # Kill kiosk browser
~/kiosk.sh                    # Restart kiosk manually
```

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review container logs: `docker-compose logs`
3. Open an issue on GitHub with:
   - Pi model and OS version
   - Docker version (`docker --version`)
   - Error messages from logs
