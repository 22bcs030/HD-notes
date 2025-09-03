/**
 * Simple OTP test using native fetch API
 */

async function testOTP() {
  console.log('\n=== Testing OTP with Fetch API ===\n');
  
  // Test the test endpoint
  console.log('1. Testing test email endpoint...');
  try {
    const testResponse = await fetch('http://localhost:8000/api/test/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✓ Test endpoint success!');
      console.log('Response:', data);
    } else {
      console.log('✗ Test endpoint failed with status:', testResponse.status);
      console.log('Response:', await testResponse.text());
    }
  } catch (error) {
    console.log('✗ Test endpoint error:', error.message);
  }
  
  // Test the auth endpoint
  console.log('\n2. Testing auth/send-otp endpoint...');
  try {
    const otpResponse = await fetch('http://localhost:8000/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    
    if (otpResponse.ok) {
      const data = await otpResponse.json();
      console.log('✓ Send OTP endpoint success!');
      console.log('Response:', data);
    } else {
      console.log('✗ Send OTP endpoint failed with status:', otpResponse.status);
      console.log('Response:', await otpResponse.text());
    }
  } catch (error) {
    console.log('✗ Send OTP endpoint error:', error.message);
  }
}

testOTP().catch(console.error);
