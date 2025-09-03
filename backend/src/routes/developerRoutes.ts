import { Router, Request, Response } from 'express';

const router = Router();

// @desc    Get the last email preview URL for development purposes
// @route   GET /api/test/last-email-url
// @access  Public (only in development)
router.get('/last-email-url', (req: Request, res: Response) => {
  // This endpoint should only be available in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' });
  }
  
  const lastEmailUrl = (global as any).lastEmailUrl;
  
  if (!lastEmailUrl) {
    return res.status(404).json({ message: 'No email has been sent yet' });
  }
  
  return res.json({ url: lastEmailUrl });
});

export default router;
