/**
 * Debug script for the OTP system
 * 
 * This script helps troubleshoot issues with the OTP system by testing
 * the API endpoints and logging detailed information.
 */

const axios = require('axios');
const http = require('http');
const https = require('https');

// Create custom Axios instance with specific configuration
const api = axios.create({
  timeout: 15000, // 15 seconds
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 0,
  validateStatus: status => status >= 200 && status < 500 // Don't reject on 4xx errors
});

// Configure axios with better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.log('=============================================');
    console.log('ERROR DETAILS:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request details:');
      console.error('- URL:', error.config?.url);
      console.error('- Method:', error.config?.method?.toUpperCase());
      console.error('- Timeout:', error.config?.timeout + 'ms');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    console.log('=============================================');
    return Promise.reject(error);
  }
);

/**
 * Test the email OTP system
 */
async function testOTPSystem() {
  try {
    console.log('\n=== Testing OTP System ===\n');
    
    // Test the test endpoint first (simpler)
    console.log('1. Testing the test email endpoint:');
    console.log('   Sending request to: http://localhost:8000/api/test/email');
    
    try {
      const testResponse = await api.post(
        'http://localhost:8000/api/test/email',
        { email: 'test@example.com' },
        { 
          timeout: 15000,
          headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          }
        }
      );
      
      console.log('   ✓ Test endpoint successful!');
      console.log('   Response:', testResponse.data);
    } catch (error) {
      console.log('   ✗ Test endpoint failed!');
      // Error details already logged by interceptor
    }
    
    console.log('\n2. Testing the auth send-otp endpoint:');
    console.log('   Sending request to: http://localhost:8000/api/auth/send-otp');
    
    try {
      const otpResponse = await api.post(
        'http://localhost:8000/api/auth/send-otp',
        { email: 'test@example.com' },
        { 
          timeout: 15000,
          headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          }
        }
      );
      
      console.log('   ✓ Send OTP endpoint successful!');
      console.log('   Response:', otpResponse.data);
    } catch (error) {
      console.log('   ✗ Send OTP endpoint failed!');
      // Error details already logged by interceptor
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Execute the test
testOTPSystem();
