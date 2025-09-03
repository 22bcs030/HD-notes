import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [viewMode, setViewMode] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle email and OTP submission
  const handleSendOtp = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      await authService.sendOTP(email);
      setViewMode('otp');
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    try {
      setLoading(true);
      const response = await authService.verifyOTP(email, otp);
      login(response.data);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Email validation function
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  
  // Switch to signup page
  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#ffffff'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: { xs: '100%', md: '50%' },
          p: { xs: 3, sm: 4 }
        }}
      >
        {/* HD Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 3 },
            mt: { xs: 1, sm: 2 }
          }}
        >
          <Box
            component="img"
            src="/assets/hd-logo.svg"
            alt="HD Logo"
            sx={{ 
              width: 24,
              height: 24,
              color: '#4285F4'
            }}
          />
          <Typography 
            variant="h6" 
            component="span" 
            sx={{ 
              ml: 1, 
              fontWeight: 500,
              color: '#000',
              fontSize: '18px'
            }}
          >
            HD
          </Typography>
        </Box>

        {/* Login form */}
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 350, 
            mx: 'auto', 
            mt: { xs: 2, sm: 3 } 
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              mb: 1, 
              fontSize: { xs: '24px', sm: '28px' }
            }}
          >
            Sign in
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: '14px',
              opacity: 0.8
            }}
          >
            Please login to continue to your account
          </Typography>

          {error && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          
          <Box>
            <Typography 
              variant="body2" 
              mb={0.5}
              sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '13px',
                fontWeight: 400
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="your_email@example.com"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={viewMode === 'otp'}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '15px',
                }
              }}
            />
            
            {/* OTP field */}
            {viewMode === 'otp' && (
              <>
                <Typography 
                  variant="body2" 
                  mb={0.5}
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '13px',
                    fontWeight: 400
                  }}
                >
                  OTP
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontSize: '15px',
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleSendOtp}
                          aria-label="resend otp"
                          size="small"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2V6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 2V6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 9H21" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.5 15.5L17.5 17.5L16 16" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12.5V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V18C3 19.6569 4.34315 21 6 21H14" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            
            {/* Main button - Get OTP or Sign In */}
            <Button
              fullWidth
              variant="contained"
              onClick={viewMode === 'form' ? handleSendOtp : handleVerifyOtp}
              disabled={loading}
              sx={{ 
                mt: 1, 
                py: 1.5, 
                borderRadius: 28,
                bgcolor: '#4285F4',
                '&:hover': {
                  bgcolor: '#3367d6',
                },
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              {loading ? 
                <CircularProgress size={24} color="inherit" /> : 
                (viewMode === 'form' ? 'Get OTP' : 'Sign in')
              }
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>
                Need an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={goToSignup}
                  sx={{ 
                    color: '#4285F4',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Create one
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Right blue wave background - only visible on medium and larger screens */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          backgroundImage: 'url(/7b63f1a45bc23337ff246ae8162bec8fa9d7190d\\ \\(1\\).jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
        }}
      />
    </Box>
  );
};

export default LoginPage;
