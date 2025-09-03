/**
 * Test Script for Notes App
 * 
 * This script helps verify the email OTP functionality in the Notes App.
 * It sends a test request to create an OTP and displays the preview URL
 * where you can view the email.
 */

const axios = require('axios');

/**
 * Test the OTP email functionality
 */
async function testOTPFunctionality() {
  try {
    console.log('=== Notes App Email OTP Test ===');
    console.log('Testing email OTP functionality...\n');

    // 1. Test the direct test endpoint
    console.log('Step 1: Testing test endpoint');
    const testResult = await axios.post('http://localhost:8000/api/test/email', {
      email: 'test@example.com'
    });
    
    console.log('Test endpoint response:', testResult.data);
    console.log('\nIf you see a "previewUrl" above, you can open it in your browser to view the test email.\n');

    // 2. Test the auth send-otp endpoint
    console.log('Step 2: Testing auth send-otp endpoint');
    const otpResult = await axios.post('http://localhost:8000/api/auth/send-otp', {
      email: 'test@example.com'
    });
    
    console.log('Auth OTP response:', otpResult.data);
    
    console.log('\n=== Test Complete ===');
    console.log('✅ The email OTP functionality is working correctly.');
    console.log('✅ Check your server console for the "Preview URL" to see the sent emails.');
    console.log('✅ You can now use the application to sign up and log in.\n');

  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
    
    console.log('\n=== Test Failed ===');
    console.log('The email OTP functionality encountered an error.');
    console.log('Make sure your server is running and accessible at http://localhost:8000');
  }
}

// Run the test
testOTPFunctionality();
