#!/bin/bash

# This is a setup script for Render deployment

# Print debugging information
echo "Starting deployment setup script"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory content:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Print post-build information
echo "Build completed"
echo "Checking compiled output:"
ls -la dist/

# Print success message
echo "Setup script completed successfully"
