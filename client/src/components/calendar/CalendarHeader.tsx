import React from 'react';
import { Box, Typography } from '@mui/material';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const CalendarHeader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        height: 'var(--calendar-header-height)',
        alignItems: 'center',
      }}
    >
      {DAYS_OF_WEEK.map((day, idx) => (
        <Box
          key={idx}
          sx={{
            textAlign: 'center',
            py: 1,
            borderRight: idx < 6 ? '1px solid var(--border-secondary)' : 'none',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'var(--font-google)',
              fontWeight: 600,
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.8px',
            }}
          >
            {day}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
