# Environment Variables Setup Guide

This guide explains how to set up all the environment variables needed for this application.

## Frontend (.env)

Create a `.env` file in the `frontend` directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### How to get these values:

1. **REACT_APP_API_URL**: This is the URL where your backend API is running. If running locally, use the default value.

2. **REACT_APP_GOOGLE_CLIENT_ID**: 
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Set Application type to "Web application"
   - Add authorized JavaScript origins (e.g., http://localhost:3000)
   - Add authorized redirect URIs (e.g., http://localhost:3000)
   - Copy the generated client ID

## Backend (.env)

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_secure_jwt_secret
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
OTP_EXPIRY=10
```

### How to get these values:

1. **PORT**: The port on which your backend server will run. Default is 8000.

2. **MONGODB_URI**: 
   - Local MongoDB: `mongodb://localhost:27017/notes-app`
   - MongoDB Atlas: Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create a cluster, and get the connection string.

3. **JWT_SECRET**: Create a strong random string for JWT signing. You can generate one with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **GMAIL_USER**: Your Gmail email address for sending OTPs.

5. **GMAIL_PASS**: 
   - Go to your Google Account > Security
   - Enable 2-Step Verification if not already enabled
   - Under "App passwords", create a new app password
   - Use this generated password

6. **GOOGLE_CLIENT_ID**: Same as the frontend (from Google Cloud Console).

7. **GOOGLE_CLIENT_SECRET**: 
   - From the same page where you got the Google Client ID
   - Copy the client secret

8. **FRONTEND_URL**: The URL where your frontend is running. If local, use the default value.

9. **OTP_EXPIRY**: Time in minutes after which OTPs expire. Default is 10 minutes.

## Production Considerations

When deploying to production:

1. Use environment variables provided by your hosting platform rather than .env files
2. Update URLs to use your production domains
3. Ensure all secrets are properly secured
4. Use production MongoDB connection with proper authentication
