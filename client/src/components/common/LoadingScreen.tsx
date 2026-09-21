import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading Google Calendar...' }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <CalendarIcon sx={{ fontSize: 48, color: 'var(--google-blue)' }} />
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'var(--font-google)',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          Calendar
        </Typography>
      </Box>
      <CircularProgress size={36} sx={{ color: 'var(--google-blue)' }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};
