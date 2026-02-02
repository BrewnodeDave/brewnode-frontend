#!/bin/bash
# Setup script for BrewNode Frontend systemd service

set -e

echo "🚀 Setting up BrewNode Frontend as a system service..."

# Configuration
SERVICE_NAME="brewnode-frontend"
SERVICE_FILE="${SERVICE_NAME}.service"
INSTALL_DIR="/home/pi/brewnode-frontend"
USER="pi"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Create installation directory if it doesn't exist
if [ ! -d "$INSTALL_DIR" ]; then
    echo "📁 Creating installation directory..."
    mkdir -p "$INSTALL_DIR"
    chown $USER:$USER "$INSTALL_DIR"
fi

# Check if dist folder exists in current directory
if [ ! -d "./dist" ]; then
    echo "❌ Error: dist folder not found. Please run 'npm run build' first."
    exit 1
fi

# Copy files to installation directory
echo "📦 Copying files to $INSTALL_DIR..."
cp -r ./dist "$INSTALL_DIR/"
cp package.json "$INSTALL_DIR/" 2>/dev/null || true

# Install dependencies as the service user
echo "📥 Installing dependencies..."
cd "$INSTALL_DIR"
sudo -u $USER npm install --production 2>/dev/null || true
sudo -u $USER npm install -g http-server 2>/dev/null || npm install -g http-server

# Copy service file to systemd
echo "⚙️  Installing systemd service..."
cp "$SERVICE_FILE" /etc/systemd/system/

# Reload systemd
echo "🔄 Reloading systemd..."
systemctl daemon-reload

# Enable service to start on boot
echo "✅ Enabling service to start on boot..."
systemctl enable $SERVICE_NAME

# Start the service
echo "▶️  Starting service..."
systemctl start $SERVICE_NAME

# Check status
sleep 2
if systemctl is-active --quiet $SERVICE_NAME; then
    echo ""
    echo "✅ BrewNode Frontend service installed and running successfully!"
    echo ""
    echo "📋 Useful commands:"
    echo "   Status:  sudo systemctl status $SERVICE_NAME"
    echo "   Stop:    sudo systemctl stop $SERVICE_NAME"
    echo "   Start:   sudo systemctl start $SERVICE_NAME"
    echo "   Restart: sudo systemctl restart $SERVICE_NAME"
    echo "   Logs:    sudo journalctl -u $SERVICE_NAME -f"
    echo ""
    echo "🌐 Access your frontend at: http://$(hostname -I | awk '{print $1}')"
else
    echo ""
    echo "❌ Service failed to start. Check logs with:"
    echo "   sudo journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi
