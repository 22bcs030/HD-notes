require('dotenv').config();
const nodemailer = require('nodemailer');

async function testWithEthereal() {
  console.log('Testing email with Ethereal...');

  try {
    // Create a test account on Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log('Created Ethereal test account:', {
      user: testAccount.user,
      pass: testAccount.pass,
      smtp: testAccount.smtp,
      imap: testAccount.imap,
      pop3: testAccount.pop3,
      web: 'https://ethereal.email'
    });

    // Create transporter using Ethereal credentials
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Generate a test OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Define email
    const mailOptions = {
      from: `"Notes App" <${testAccount.user}>`,
      to: "test@example.com", // Doesn't matter for Ethereal
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
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Get URL to view the email in Ethereal
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('Open this URL in your browser to see the email');
  } catch (error) {
    console.error('Error in Ethereal test:', error);
  }
}

// Run the Ethereal test
testWithEthereal();
