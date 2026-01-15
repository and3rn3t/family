# =============================================================================
# Family Organizer - Build for Raspberry Pi (Windows PowerShell)
# Creates a Docker image that can be loaded directly on a Raspberry Pi
# =============================================================================

param(
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"

# Configuration
$ImageName = "family-organizer"
$OutputFile = "family-organizer-pi-$Version.tar.gz"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║       🏠 Family Organizer - Raspberry Pi Build              ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Check Docker
try {
    docker version | Out-Null
} catch {
    Write-Host "❌ Docker is not installed or not running" -ForegroundColor Red
    exit 1
}

# Check buildx
try {
    docker buildx version | Out-Null
} catch {
    Write-Host "❌ Docker Buildx is not available" -ForegroundColor Red
    Write-Host "Install Docker Desktop or enable buildx"
    exit 1
}

# Setup buildx builder
$BuilderName = "pi-builder"
Write-Host "🔧 Setting up build environment..." -ForegroundColor Yellow

$existingBuilder = docker buildx inspect $BuilderName 2>&1
if ($LASTEXITCODE -ne 0) {
    docker buildx create --name $BuilderName --driver docker-container --use
    docker buildx inspect --bootstrap
} else {
    docker buildx use $BuilderName
}

Write-Host ""
Write-Host "🏗️  Building for Raspberry Pi (ARM64)..." -ForegroundColor Yellow
Write-Host "   This may take 5-10 minutes..."
Write-Host ""

# Build for ARM64 (Pi 3B+, Pi 4, Pi 5) and output as tar
docker buildx build `
    --platform linux/arm64 `
    --tag "${ImageName}:${Version}" `
    --tag "${ImageName}:latest" `
    --file Dockerfile `
    --output "type=docker,dest=$OutputFile" `
    .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Get file size
$FileSize = (Get-Item $OutputFile).Length / 1MB
$FileSizeStr = "{0:N1} MB" -f $FileSize

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✅ Build Complete!                        ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Output: " -NoNewline
Write-Host "$OutputFile" -ForegroundColor Yellow -NoNewline
Write-Host " ($FileSizeStr)"
Write-Host ""
Write-Host "To deploy to your Raspberry Pi:" -ForegroundColor Blue
Write-Host ""
Write-Host "  1. Copy the image to your Pi:"
Write-Host "     scp $OutputFile pi@<pi-ip>:~/" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. On the Pi, load the image:"
Write-Host "     gunzip -c $OutputFile | docker load" -ForegroundColor Yellow
Write-Host ""
Write-Host "  3. Run the container:"
Write-Host "     docker run -d --name family-organizer -p 80:80 --restart unless-stopped ${ImageName}:${Version}" -ForegroundColor Yellow
Write-Host ""
