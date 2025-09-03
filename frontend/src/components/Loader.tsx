import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoaderProps {
  size?: number;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      py={4}
    >
      <CircularProgress size={size} color="primary" />
      <Typography variant="body1" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
