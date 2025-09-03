import express from 'express';
import { testEmail } from '../controllers/testController';

const router = express.Router();

// Test endpoints
router.post('/email', testEmail);

export default router;
