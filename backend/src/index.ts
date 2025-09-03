import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { initializeEmailService } from './utils/emailService';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import testRoutes from './routes/testRoutes';
import developerRoutes from './routes/developerRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/test', testRoutes);
// Only add developer routes in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', developerRoutes);
}

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Initialize email service and start server
(async () => {
  try {
    // Initialize email service first
    console.log('Initializing email service...');
    await initializeEmailService();
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
