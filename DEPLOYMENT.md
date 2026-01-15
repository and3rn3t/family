# 🏠 Family Organizer - Raspberry Pi Deployment Guide

Deploy the Family Organizer as a kiosk display on your Raspberry Pi.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Build the Docker Image](#build-the-docker-image)
- [Deploy to Raspberry Pi](#deploy-to-raspberry-pi)
- [Kiosk Mode Setup](#kiosk-mode-setup)
- [Management Commands](#management-commands)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

**From your development machine (Windows/Mac/Linux):**

```bash
# Build the deployment package
./scripts/create-pi-package.sh

# Copy to Pi
scp family-organizer-pi-1.0.0.zip pi@raspberrypi.local:~/
```

**On your Raspberry Pi:**

```bash
# Extract and install
unzip family-organizer-pi-1.0.0.zip
cd family-organizer-pi-package
./install.sh
```

Open `http://<pi-ip-address>` in a browser!

---

## Prerequisites

### On Your Development Machine

- Docker Desktop with buildx support
- Git (to clone the repo)

### On Raspberry Pi

- Raspberry Pi 3B+, 4, or 5
- Raspberry Pi OS (64-bit recommended for best performance)
- At least 1GB free disk space
- Network connection

Docker will be automatically installed by the install script if not present.

---

## Build the Docker Image

### Option 1: Full Deployment Package (Recommended)

Creates a complete package with Docker image + all deployment scripts:

```bash
# From the project root
./scripts/create-pi-package.sh 1.0.0
```

This creates `family-organizer-pi-1.0.0.zip` containing:

- `family-organizer.tar.gz` - Docker image for ARM64
- `install.sh` - One-click installer
- `uninstall.sh` - Clean removal script
- `setup-kiosk.sh` - Optional kiosk mode setup
- `docker-compose.yml` - Docker configuration
- `README.txt` - Quick reference

### Option 2: Just the Docker Image

If you only need the Docker image:

```bash
./scripts/build-for-pi.sh latest
```

This creates `family-organizer-pi-latest.tar.gz`.

### Option 3: Build on the Pi Directly

If your Pi has enough resources (Pi 4 with 4GB+ RAM):

```bash
# Clone the repo on your Pi
git clone https://github.com/your-repo/family-organizer.git
cd family-organizer

# Build locally
docker build -t family-organizer:latest .

# Run
docker-compose up -d
```

---

## Deploy to Raspberry Pi

### Step 1: Copy Files to Pi

```bash
# Using SCP (replace with your Pi's IP)
scp family-organizer-pi-1.0.0.zip pi@192.168.1.100:~/

# Or using rsync
rsync -avz family-organizer-pi-1.0.0.zip pi@192.168.1.100:~/
```

### Step 2: Install on Pi

SSH into your Pi:

```bash
ssh pi@192.168.1.100
```

Extract and install:

```bash
unzip family-organizer-pi-1.0.0.zip
cd family-organizer-pi-package
./install.sh
```

The install script will:

1. Install Docker if not present
2. Load the Docker image
3. Start the container
4. Display the URL to access the app

### Step 3: Access the App

Open a browser and go to:

```
http://<pi-ip-address>
```

Or from the Pi itself:

```
http://localhost
```

---

## Kiosk Mode Setup

Make your Pi boot directly into the Family Organizer display.

### Automatic Setup

```bash
cd family-organizer-pi-package
./setup-kiosk.sh
sudo reboot
```

### What Kiosk Mode Does

- Boots directly into Chromium in fullscreen
- Hides the cursor after 3 seconds of inactivity
- Disables screen blanking/screensaver
- Auto-starts on boot

### Exit Kiosk Mode

- Press `Alt+F4` to close Chromium
- Or SSH in and run: `pkill chromium`

### Disable Kiosk Mode

```bash
rm ~/.config/autostart/kiosk.desktop
sudo reboot
```

---

## Management Commands

### Container Management

```bash
# View status
docker ps

# View logs
docker logs family-organizer

# Follow logs in real-time
docker logs -f family-organizer

# Restart
docker-compose restart

# Stop
docker-compose down

# Start
docker-compose up -d
```

### Update to New Version

```bash
# Stop current version
docker-compose down

# Load new image
gunzip -c family-organizer-new.tar.gz | docker load

# Start
docker-compose up -d
```

### Backup Data

The app stores data in the browser's localStorage. To backup:

1. Open the app in a browser
2. Go to Management tab
3. Click "Backup" button
4. Save the JSON file

### Resource Monitoring

```bash
# Memory usage
free -h

# Docker stats
docker stats family-organizer

# Disk usage
df -h
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs family-organizer

# Check if port 80 is in use
sudo netstat -tlnp | grep :80

# Use different port
# Edit docker-compose.yml: change "80:80" to "8080:80"
```

### Out of Memory

The Pi may run low on memory. Solutions:

```bash
# Check memory
free -h

# Reduce container memory limit in docker-compose.yml
# Change memory: 256M to memory: 128M

# Add swap space
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # Set CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Display Issues in Kiosk Mode

```bash
# Check if Chromium is running
ps aux | grep chromium

# Manually start kiosk
~/kiosk.sh

# Check X server logs
cat ~/.xsession-errors
```

### Network Issues

```bash
# Check Pi's IP
hostname -I

# Test container
curl http://localhost

# Check Docker network
docker network ls
```

### Slow Performance

For Pi 3B+ or older:

1. Use a high-quality SD card (Class 10 or better)
2. Reduce animations in the app (Settings)
3. Close other running applications
4. Consider overclocking (at your own risk)

---

## Hardware Recommendations

### Minimum

- Raspberry Pi 3B+
- 16GB SD card
- 2.5A power supply

### Recommended

- Raspberry Pi 4 (2GB+ RAM)
- 32GB SD card (Class 10)
- 3A USB-C power supply
- Official 7" touchscreen or HDMI monitor

### Optimal Kiosk Setup

- Raspberry Pi 4 (4GB RAM)
- 64GB SD card
- Official touchscreen with case
- Hardwired ethernet for reliability

---

## Security Notes

- The app runs on HTTP (port 80) by default
- Data is stored locally in the browser
- No data leaves your local network
- Consider setting up a firewall if exposed to untrusted networks

```bash
# Basic firewall setup
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw enable
```

---

## Support

- **Issues**: Report on GitHub
- **Logs**: Always include `docker logs family-organizer` output
- **System Info**: Include `uname -a` and `free -h` output
