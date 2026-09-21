import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchEventsForRange } from '../../redux/eventSlice';
import dayjs from 'dayjs';

export const MonthCalendar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentDate,
    events,
    activeCategoryFilters,
    searchQuery,
    isLoading,
  } = useSelector((state: RootState) => state.events);

  const currDay = dayjs(currentDate);

  useEffect(() => {
    const start = currDay.startOf('month').subtract(7, 'day').format('YYYY-MM-DD');
    const end = currDay.endOf('month').add(7, 'day').format('YYYY-MM-DD');
    dispatch(fetchEventsForRange({ start, end }));
  }, [dispatch, currentDate]);

  const filteredEvents = events.filter((evt) => {
    const matchesCategory = activeCategoryFilters.includes(evt.category);
    const matchesSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      <CalendarHeader />
      <CalendarGrid currentDate={currDay} events={filteredEvents} />
    </Box>
  );
};
