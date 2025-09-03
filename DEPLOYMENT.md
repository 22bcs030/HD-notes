# Login App Deployment Guide

This guide provides step-by-step instructions for deploying your login application.

## Option 1: Deploy using Vercel and Render (Recommended for beginners)

### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com)

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Navigate to your frontend directory and deploy:
   ```bash
   cd frontend
   vercel
   ```

5. For subsequent deployments:
   ```bash
   vercel --prod
   ```

### Backend Deployment (Render)

1. Create a Render account at [render.com](https://render.com)

2. Create a new Web Service and connect your GitHub repository.

3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. Add the required environment variables in the Render dashboard:
   - PORT
   - MONGODB_URI (You'll need a MongoDB database, consider using MongoDB Atlas)
   - JWT_SECRET
   - GMAIL_USER
   - GMAIL_PASS
   - FRONTEND_URL (Your Vercel URL)
   - OTP_EXPIRY

5. Click "Create Web Service"

6. After deployment, update your frontend's `.env.production` file with the new backend URL.

## Option 2: Deploy using Docker (For advanced users)

1. Install Docker and Docker Compose on your server.

2. Copy your project files to the server.

3. Set up environment variables:
   ```bash
   export GMAIL_USER=your_email@gmail.com
   export GMAIL_PASS=your_app_password
   ```

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

5. Access your application at your server's IP address.

## Option 3: Deploy to Heroku

### Frontend Deployment

1. Create a new Heroku app:
   ```bash
   heroku create login-app-frontend
   ```

2. Add a heroku-postbuild script in your package.json:
   ```json
   "scripts": {
     "heroku-postbuild": "npm run build"
   }
   ```

3. Create a `static.json` file:
   ```json
   {
     "root": "build/",
     "routes": {
       "/**": "index.html"
     }
   }
   ```

4. Deploy your frontend:
   ```bash
   git subtree push --prefix frontend heroku master
   ```

### Backend Deployment

1. Create another Heroku app:
   ```bash
   heroku create login-app-backend
   ```

2. Set up the environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set GMAIL_USER=your_email
   heroku config:set GMAIL_PASS=your_password
   heroku config:set FRONTEND_URL=your_frontend_url
   heroku config:set OTP_EXPIRY=10
   ```

3. Deploy your backend:
   ```bash
   git subtree push --prefix backend heroku master
   ```

## Database Setup

For production, you should use a hosted MongoDB service:

1. Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string and update your backend environment variables

## Important Security Considerations

1. Use strong, unique secrets for JWT_SECRET
2. Enable HTTPS for all production deployments
3. Set up proper CORS configuration
4. Use environment variables for all sensitive information
5. Consider rate limiting for the OTP endpoints to prevent abuse
6. Implement proper logging for debugging

## Monitoring and Maintenance

1. Set up monitoring for your application (e.g., UptimeRobot, Sentry)
2. Implement proper logging
3. Set up regular database backups
4. Keep your dependencies updated
