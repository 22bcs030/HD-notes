#!/bin/bash

# Exit on error
set -e

# Function to display messages
display() {
  echo "===== $1 ====="
}

# Check if MongoDB is installed
display "Checking MongoDB"
if command -v mongod &> /dev/null; then
  echo "MongoDB is installed."
else
  echo "MongoDB is not installed. Please install MongoDB first or use MongoDB Atlas."
  echo "Visit: https://www.mongodb.com/try/download/community"
  exit 1
fi

# Build the application
display "Building the application"
npm run --prefix frontend build
npm run --prefix backend build

# Create production .env files if they don't exist
if [ ! -f backend/.env ]; then
  display "Creating backend .env file"
  cp backend/.env.sample backend/.env
  echo "Please update the values in backend/.env with your production settings!"
fi

if [ ! -f frontend/.env.production ]; then
  display "Creating frontend .env.production file"
  echo "REACT_APP_API_URL=http://localhost:8000/api" > frontend/.env.production
  echo "Please update the REACT_APP_API_URL in frontend/.env.production with your production backend URL!"
fi

display "Deployment preparation complete!"
echo "Next steps:"
echo "1. Update environment variables in backend/.env and frontend/.env.production"
echo "2. Deploy the backend by running: node backend/dist/index.js"
echo "3. Serve the frontend from: frontend/build"
echo ""
echo "For more deployment options and detailed instructions, see DEPLOYMENT.md"
