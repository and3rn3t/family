# Family Organizer - Deployment Guide

## Running Locally (Development)

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Deploying to Raspberry Pi 4B with Docker

### Prerequisites

1. Raspberry Pi 4B with Raspberry Pi OS installed
2. Docker and Docker Compose installed on the Pi

### Installing Docker on Raspberry Pi

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt-get install docker-compose -y

# Reboot to apply group changes
sudo reboot
```

### Building and Running the Application

1. **Transfer files to your Raspberry Pi**

   ```bash
   # On your local machine
   scp -r /path/to/spark-template pi@<raspberry-pi-ip>:~/family-organizer
   ```

2. **SSH into your Raspberry Pi**

   ```bash
   ssh pi@<raspberry-pi-ip>
   cd ~/family-organizer
   ```

3. **Build and start the container**

   ```bash
   docker-compose up -d --build
   ```

4. **Check if the container is running**

   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

5. **Access the application**

   Open a browser and navigate to:
   - From the Pi: `http://localhost`
   - From another device on your network: `http://<raspberry-pi-ip>`

### Setting up Kiosk Mode

To run the app in kiosk mode on an external display connected to your Raspberry Pi:

1. **Install Chromium (if not already installed)**

   ```bash
   sudo apt-get install chromium-browser unclutter -y
   ```

2. **Create a kiosk startup script**

   ```bash
   nano ~/kiosk.sh
   ```

   Add the following content:

   ```bash
   #!/bin/bash
   
   # Disable screen blanking
   xset s off
   xset -dpms
   xset s noblank
   
   # Hide mouse cursor after inactivity
   unclutter -idle 0.5 -root &
   
   # Start Chromium in kiosk mode
   chromium-browser --noerrdialogs \
     --disable-infobars \
     --kiosk \
     --incognito \
     --disable-session-crashed-bubble \
     --check-for-update-interval=31536000 \
     http://localhost
   ```

   Make it executable:

   ```bash
   chmod +x ~/kiosk.sh
   ```

3. **Auto-start on boot**

   Edit the autostart file:

   ```bash
   mkdir -p ~/.config/lxsession/LXDE-pi
   nano ~/.config/lxsession/LXDE-pi/autostart
   ```

   Add this line:

   ```
   @/home/pi/kiosk.sh
   ```

4. **Reboot to start kiosk mode**

   ```bash
   sudo reboot
   ```

### Managing the Application

**Stop the container:**
```bash
docker-compose down
```

**Restart the container:**
```bash
docker-compose restart
```

**View logs:**
```bash
docker-compose logs -f
```

**Update the application:**
```bash
git pull  # if using git
docker-compose up -d --build
```

### Data Persistence

All application data is stored in the `./data` directory on your Pi, which is mounted as a volume in the Docker container. This ensures your family members and chores persist across container restarts.

### Troubleshooting

**Container won't start:**
```bash
docker-compose logs family-organizer
```

**Can't access from other devices:**
- Check firewall settings: `sudo ufw allow 80`
- Verify the Pi's IP address: `hostname -I`

**Kiosk mode issues:**
- Check if Chromium is running: `ps aux | grep chromium`
- Test the script manually: `~/kiosk.sh`
- Check X server logs: `cat ~/.xsession-errors`

### Network Access

To access the app from any device on your local network:

1. Find your Raspberry Pi's IP address:
   ```bash
   hostname -I
   ```

2. On any device connected to the same network, open a browser and go to:
   ```
   http://<raspberry-pi-ip>
   ```

3. For easier access, you can set a static IP for your Pi in your router settings or use mDNS:
   ```
   http://raspberrypi.local
   ```
