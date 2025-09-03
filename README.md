# Full Stack Note-Taking Application

A responsive note-taking application with authentication (email/OTP and Google) and CRUD operations for notes.

## Technology Stack

- **Frontend**: ReactJS (TypeScript), Material-UI
- **Backend**: Express.js (TypeScript)
- **Database**: MongoDB
- **Authentication**: JWT, Google OAuth
- **Version Control**: Git

## Features

- User authentication (Email/OTP and Google OAuth)
- Create, read, and delete notes
- Responsive design
- JWT-based authorization

## Project Structure

```
/
├── frontend/            # React TypeScript frontend
├── backend/             # Express TypeScript backend
├── .gitignore           # Git ignore file
└── README.md            # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Email Verification System

This application uses **Ethereal Email** for testing the email verification system:

1. When a user signs up or requests to log in, they receive an OTP
2. The OTP is sent using Ethereal Email (a fake SMTP service for testing)
3. In the server console, you'll see a "Preview URL" where you can view the sent emails
4. Copy and paste this URL into your browser to see the email with the OTP
5. Use this OTP to verify your account

Example of server console output:
```
Sending OTP to test@example.com...
Email sent successfully, message ID: <8ac5ddec-1bfd-707b-ea45-ccd950712b11@ethereal.email>
▶ Preview URL (open to view email): https://ethereal.email/message/aLhanktUvPQAyBXVaLhaoaqYuaj5Kh6iAAAAAU8CAEmn-G.kR08VXdaRPRQ
```
npm run dev
```

### Environment Variables

Create `.env` files in both frontend and backend directories:

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Backend (.env)
```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail
GMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

## Deployment

The application is deployed at: [Project URL]

## License

MIT
