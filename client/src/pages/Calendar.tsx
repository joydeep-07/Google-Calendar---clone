import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AppLayout } from '../components/layout/AppLayout';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { EventDialog } from '../components/events/EventDialog';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { clearNotification } from '../redux/eventSlice';

export const CalendarPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notificationMessage } = useSelector((state: RootState) => state.events);

  const handleCloseNotification = () => {
    dispatch(clearNotification());
  };

  return (
    <AppLayout>
      <MonthCalendar />
      <EventDialog />

      <Snackbar
        open={Boolean(notificationMessage)}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};
