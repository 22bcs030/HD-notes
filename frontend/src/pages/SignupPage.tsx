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
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Removed unused dayjs import but keep the type
import type { Dayjs } from 'dayjs';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  // Using viewMode state instead of isOtpSent for conditional rendering
  const [viewMode, setViewMode] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate form
  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    
    if (!dob) {
      setError('Date of Birth is required');
      return false;
    }
    
    setError('');
    return true;
  };

  // Handle OTP sending
  const handleSendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Send OTP to the user's email
      await authService.sendOTP(email);
      setViewMode('otp');
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle signup with OTP verification
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      setLoading(true);
      
      const response = await authService.verifyOTP(
        email, 
        otp, 
        name, 
        dob?.format('YYYY-MM-DD')
      );
      
      login(response.data);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Switch to login page
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#ffffff',
        fontFamily: "'Inter', sans-serif"
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
            justifyContent: { xs: 'center', sm: 'flex-start' },
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
              fontSize: '18px',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            HD
          </Typography>
        </Box>

        {/* Sign up form */}
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 350, 
            mx: 'auto', 
            mt: { xs: 2, sm: 3 },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              mb: 1, 
              fontSize: { xs: '24px', sm: '28px' },
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Sign up
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: '14px',
              opacity: 0.8,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Sign up to enjoy the feature of HD
          </Typography>

          {error && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ mb: 2, fontFamily: "'Inter', sans-serif" }}
            >
              {error}
            </Typography>
          )}
          
          <Box>
            {/* Name field */}
            <Box sx={{ 
              position: 'relative', 
              mb: 2.5
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: 500,
                  position: 'absolute',
                  top: -8,
                  left: 10,
                  zIndex: 1,
                  backgroundColor: '#fff',
                  px: 0.5,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Your Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Jonas Khanwald"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={viewMode === 'otp'}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#bbbbbb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4285F4',
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    fontFamily: "'Inter', sans-serif",
                    py: 1.5
                  }
                }}
              />
            </Box>
            
            {/* Date of Birth field */}
            <Box sx={{ 
              position: 'relative', 
              mb: 2.5
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: 500,
                  position: 'absolute',
                  top: -8,
                  left: 10,
                  zIndex: 1,
                  backgroundColor: '#fff',
                  px: 0.5,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Date of Birth
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dob}
                  onChange={(newValue) => setDob(newValue)}
                  disabled={viewMode === 'otp'}
                  sx={{ 
                    width: '100%'
                  }}
                  format="DD MMMM YYYY"
                  slots={{
                    openPickerIcon: CalendarTodayOutlinedIcon
                  }}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      placeholder: "11 December 1997",
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          fontFamily: "'Inter', sans-serif",
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#bbbbbb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4285F4',
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '16px',
                          fontFamily: "'Inter', sans-serif",
                          py: 1.5,
                          height: '24px' // Match height with other fields
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
            
            {/* Email field */}
            <Box sx={{ 
              position: 'relative', 
              mb: 2.5
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: 500,
                  position: 'absolute',
                  top: -8,
                  left: 10,
                  zIndex: 1,
                  backgroundColor: '#fff',
                  px: 0.5,
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="jonas_kahnwald@gmail.com"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={viewMode === 'otp'}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#bbbbbb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4285F4',
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    fontFamily: "'Inter', sans-serif",
                    py: 1.5
                  }
                }}
              />
            </Box>

            {/* OTP field */}
            {viewMode === 'otp' && (
              <Box sx={{ 
                position: 'relative', 
                mb: 2.5
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '13px',
                    fontWeight: 500,
                    position: 'absolute',
                    top: -8,
                    left: 10,
                    zIndex: 1,
                    backgroundColor: '#fff',
                    px: 0.5,
                    fontFamily: "'Inter', sans-serif"
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
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#bbbbbb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4285F4',
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '16px',
                      fontFamily: "'Inter', sans-serif",
                      py: 1.5
                    }
                  }}
                />
              </Box>
            )}
            
            {/* Action buttons */}
            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={viewMode === 'form' ? handleSendOTP : handleVerifyOTP}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                borderRadius: 1,
                bgcolor: '#4285F4',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px',
                fontFamily: "'Inter', sans-serif",
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#3367d6',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : viewMode === 'form' ? (
                'Get OTP'
              ) : (
                'Verify OTP'
              )}
            </Button>
            
            {/* Sign in link */}
            <Box 
              sx={{ 
                textAlign: 'center',
                mt: 2 
              }}
            >
              <Typography 
                variant="body2" 
                component="span" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif" 
                }}
              >
                Already have an account?{' '}
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={goToLogin}
                sx={{ 
                  color: '#4285F4',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                Sign in
              </Link>
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

export default SignupPage;
