require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Starting email test...');
  
  // Log the email configuration being used
  console.log('Email configuration:', {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS ? '********' : 'not set'
    }
  });

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Define email
    const mailOptions = {
      from: `"Notes App Test" <${process.env.GMAIL_USER}>`,
      to: process.env.TEST_EMAIL || process.env.GMAIL_USER, // Send to test email or self
      subject: 'Test Email - Notes App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #1976d2; text-align: center;">Notes App</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">This is a test email to verify your email configuration.</p>
          <p style="font-size: 16px;">If you received this email, your configuration is correct!</p>
          <p style="font-size: 16px;">Best regards,<br>The Notes App Team</p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();
