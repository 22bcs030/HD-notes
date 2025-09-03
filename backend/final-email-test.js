// Final test script for Ethereal email
require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Test the email functionality using Ethereal
 */
async function testEmailFunctionality() {
  try {
    console.log('Starting email test...');
    
    // Create a test account
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('Created Ethereal account:', {
      user: testAccount.user,
      pass: testAccount.pass,
      smtp: testAccount.smtp,
      web: 'https://ethereal.email'
    });
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Notes App" <${testAccount.user}>`,
      to: "test@example.com",
      subject: "Your Verification Code",
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
      `
    });
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Get URL to view the email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL:', previewUrl);
    console.log('Open this URL in your browser to view the test email');
    
    console.log('\nInstructions for implementing in your application:');
    console.log('1. Replace Gmail config with Ethereal in your emailService.ts');
    console.log('2. Create a test account at startup and store it');
    console.log('3. Use the test account for all emails during development');
    console.log('4. Check server console logs for preview URLs to view sent emails');
    console.log('5. For production, switch to a real email service');
  } catch (error) {
    console.error('Error testing email:', error);
  }
}

// Run the test
testEmailFunctionality();
