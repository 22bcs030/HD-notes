const axios = require('axios');

async function testOTPSystem() {
  try {
    console.log('Running OTP system test...');
    
    // Test email address
    const testEmail = 'test@example.com';
    
    // Step 1: Send OTP
    console.log(`Step 1: Sending OTP to ${testEmail}`);
    const sendOTPResponse = await axios.post('http://localhost:8000/api/auth/send-otp', {
      email: testEmail
    });
    
    console.log('Send OTP Response:', sendOTPResponse.data);
    console.log('OTP sent successfully!');
    
    // Wait for a few seconds to simulate user receiving email
    console.log('Waiting for 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Check for preview URL in server logs
    console.log('Step 2: Checking server logs for Ethereal email preview URL');
    console.log('If using Ethereal, check the server console for a "Preview URL" link to see the email with OTP');
    
    // Test the email test endpoint too
    console.log('\nAlso testing direct email endpoint...');
    const testEmailResponse = await axios.post('http://localhost:8000/api/test/email', {
      email: testEmail
    });
    
    console.log('Test Email Response:', testEmailResponse.data);
    console.log('Test complete! Check server console for email preview URLs');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testOTPSystem();
