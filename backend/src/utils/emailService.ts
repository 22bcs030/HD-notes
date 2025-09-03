import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Transporter for sending emails
let emailTransporter: nodemailer.Transporter | null = null;

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Initialize the email service
 * This should be called when the server starts
 */
export const initializeEmailService = async (): Promise<void> => {
  try {
    console.log('Initializing email service...');
    
    // Configure for Gmail
    emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verify connection
    await emailTransporter.verify();
    console.log('Email service initialized successfully with Gmail');
    console.log(`Using email account: ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('Failed to initialize email service:', error);
    console.error('Please check your EMAIL_USER and EMAIL_PASS in .env file');
    
    // Create a fallback transporter for development if needed
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating fallback Ethereal account for development...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        emailTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          },
          logger: true
        });
        console.log('Fallback email service created for development');
      } catch (fallbackError) {
        console.error('Failed to create fallback email service:', fallbackError);
        throw new Error('Email service initialization failed completely');
      }
    } else {
      throw new Error('Email service initialization failed');
    }
  }
};

/**
 * Send OTP via email
 * @param email - Recipient email
 * @param otp - OTP code to send
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    console.log(`Sending OTP to ${email}...`);
    
    // Make sure we have a transporter
    if (!emailTransporter) {
      console.log('Email transporter not initialized, initializing email service...');
      await initializeEmailService();
      
      // Double-check if initialization succeeded
      if (!emailTransporter) {
        console.error('Failed to initialize email service, cannot send email');
        return false;
      }
    }
    
    // Define email content with improved styling
    const mailOptions = {
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #1976d2; text-align: center;">Notes App</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Your verification code is:</p>
          <h1 style="text-align: center; letter-spacing: 5px; font-size: 32px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">${otp}</h1>
          <p style="font-size: 16px;">This code will expire in 10 minutes.</p>
          <p style="font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          <p style="font-size: 16px;">Best regards,<br>The Notes App Team</p>
        </div>
      `,
      // Add plain text alternative for better deliverability
      text: `Hello,\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nThe Notes App Team`,
    };

    console.log(`Sending email from ${process.env.EMAIL_USER} to ${email}...`);
    
    // Send email
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully, message ID:', info.messageId);
    
    // If using Ethereal for development fallback, show the preview URL
    if (info && typeof nodemailer.getTestMessageUrl === 'function') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('▶ Preview URL (for development only):', previewUrl);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return false;
  }
};
