import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { setCurrentDate, fetchEventsForRange } from '../../redux/eventSlice';
import dayjs from 'dayjs';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentDate } = useSelector((state: RootState) => state.events);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  const handlePrevMonth = () => {
    const newDate = dayjs(currentDate).subtract(1, 'month');
    dispatch(setCurrentDate(newDate.toISOString()));
    
    const start = newDate.startOf('month').subtract(7, 'day').format('YYYY-MM-DD');
    const end = newDate.endOf('month').add(7, 'day').format('YYYY-MM-DD');
    dispatch(fetchEventsForRange({ start, end }));
  };

  const handleNextMonth = () => {
    const newDate = dayjs(currentDate).add(1, 'month');
    dispatch(setCurrentDate(newDate.toISOString()));

    const start = newDate.startOf('month').subtract(7, 'day').format('YYYY-MM-DD');
    const end = newDate.endOf('month').add(7, 'day').format('YYYY-MM-DD');
    dispatch(fetchEventsForRange({ start, end }));
  };

  const handleToday = () => {
    const today = dayjs();
    dispatch(setCurrentDate(today.toISOString()));

    const start = today.startOf('month').subtract(7, 'day').format('YYYY-MM-DD');
    const end = today.endOf('month').add(7, 'day').format('YYYY-MM-DD');
    dispatch(fetchEventsForRange({ start, end }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - var(--navbar-height))', overflow: 'hidden' }}>
        {!isMobile && <Sidebar />}

        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            slotProps={{
              paper: {
                sx: { width: 'var(--sidebar-width)', p: 0 },
              },
            }}
          >
            <Sidebar />
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
