#!/bin/bash

# Build the frontend
echo "Building frontend..."
cd frontend
npm run build

# Build the backend
echo "Building backend..."
cd ../backend
npm run build

echo "Build process completed!"
