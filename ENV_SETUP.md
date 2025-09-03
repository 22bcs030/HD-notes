# Setting up Environment Variables

This project requires several environment variables to work properly. Here's a guide on how to set them up:

## Frontend (.env)

Create a `.env` file in the frontend root directory with:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### How to get Google Client ID:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set Application type to "Web application"
6. Add authorized JavaScript origins (e.g., http://localhost:3000)
7. Add authorized redirect URIs (e.g., http://localhost:3000)
8. Copy the generated client ID

## Backend (.env)

Create a `.env` file in the backend root directory with:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail
GMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
OTP_EXPIRY=10
```

### Detailed instructions for each variable:

1. **MongoDB URI:**
   - For local development: `mongodb://localhost:27017/notes-app`
   - For MongoDB Atlas:
     - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Create a new cluster (free tier is sufficient)
     - Connect to your application and copy the connection string
     - Replace `<username>` and `<password>` with your Atlas credentials

2. **JWT Secret:**
   - This should be a long, random string
   - Generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Gmail Credentials for OTP:**
   - Use your Gmail address for GMAIL_USER
   - For GMAIL_PASS, you need to generate an App Password:
     - Go to your Google Account > Security
     - Enable 2-Step Verification if not already enabled
     - Go to App passwords (under "Signing in to Google")
     - Select "Mail" and "Other (Custom name)"
     - Generate and copy the 16-character password

4. **Google OAuth:**
   - GOOGLE_CLIENT_ID: Same as the frontend
   - GOOGLE_CLIENT_SECRET: From the same Google Cloud Console page, copy the client secret

5. **OTP_EXPIRY:**
   - Time in minutes after which OTPs expire (default is 10 minutes)

## Development vs Production

- For development, these variables can be placed in .env files
- For production, set these environment variables in your hosting platform (Heroku, Vercel, Render, etc.)
- Always keep .env files out of version control (add them to .gitignore)
- For production deployment, use HTTPS URLs
