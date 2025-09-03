import { Request, Response } from 'express';
import { sendOTPEmail, generateOTP } from '../utils/emailService';

// @desc    Test Email Functionality
// @route   POST /api/test/email
// @access  Public
export const testEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ message: 'Email address is required' });
      return;
    }
    
    console.log(`Testing email functionality with address: ${email}`);
    
    // Generate a test OTP
    const otp = generateOTP();
    console.log(`Generated test OTP: ${otp}`);
    
    // Send test email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
      console.log('Test email sent successfully');
      // If we're using Ethereal, include the preview URL
      const previewUrl = (global as any).lastEmailUrl;
      
      res.status(200).json({ 
        message: 'Test email sent successfully!', 
        previewUrl: previewUrl || 'No preview URL available'
      });
    } else {
      console.error('Failed to send test email');
      res.status(500).json({ message: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Error in test email endpoint:', error);
    res.status(500).json({ message: 'Server error during email test' });
  }
};
