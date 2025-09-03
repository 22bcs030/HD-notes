const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Set up Ethereal test account
let testAccount = null;
let transporter = null;

async function setupEthereal() {
  try {
    testAccount = await nodemailer.createTestAccount();
    console.log('Created Ethereal test account:', {
      user: testAccount.user,
      web: 'https://ethereal.email'
    });
    
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('Email transporter set up successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up Ethereal email:', error);
    return false;
  }
}

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Simple email test server is running' });
});

app.post('/send-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!transporter) {
      await setupEthereal();
    }
    
    // Generate a test OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Define email
    const mailOptions = {
      from: `"Test App" <${testAccount.user}>`,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    res.status(200).json({
      message: 'Email sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Initialize
setupEthereal().then(() => {
  // Start server
  const PORT = 3030;
  app.listen(PORT, () => {
    console.log(`Simple test server running on port ${PORT}`);
  });
});
