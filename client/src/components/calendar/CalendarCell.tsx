import React, { useState } from 'react';
import { Box, Typography, Popover, List, ListItem, Button } from '@mui/material';
import { EventCard } from './EventCard';
import type { IEvent } from '../../types/event';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { openCreateEventDialog, openViewEventDialog } from '../../redux/eventSlice';
import dayjs from 'dayjs';

interface CalendarCellProps {
  day: dayjs.Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: IEvent[];
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  isCurrentMonth,
  isToday,
  events,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const dateString = day.format('YYYY-MM-DD');

  const handleCellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(openCreateEventDialog(dateString));
    }
  };

  const handleEventClick = (e: React.MouseEvent, event: IEvent) => {
    e.stopPropagation();
    dispatch(openViewEventDialog(event));
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverAnchor(e.currentTarget as HTMLElement);
  };

  const handleClosePopover = () => {
    setPopoverAnchor(null);
  };

  const MAX_VISIBLE_EVENTS = 3;
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const hiddenCount = events.length - MAX_VISIBLE_EVENTS;

  return (
    <Box
      onClick={handleCellClick}
      sx={{
        height: '100%',
        minHeight: '100px',
        p: 0.8,
        borderRight: '1px solid var(--border-secondary)',
        borderBottom: '1px solid var(--border-secondary)',
        backgroundColor: !isCurrentMonth
          ? 'var(--bg-secondary)'
          : isToday
          ? 'var(--google-blue-light)'
          : 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        '&:hover': {
          backgroundColor: isToday ? 'var(--google-blue-light)' : 'var(--bg-hover)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontFamily: 'var(--font-google)',
            fontWeight: isToday ? 700 : 500,
            fontSize: '12px',
            color: !isCurrentMonth
              ? 'var(--text-disabled)'
              : isToday
              ? 'var(--text-on-primary)'
              : 'var(--text-primary)',
            backgroundColor: isToday ? 'var(--google-blue)' : 'transparent',
          }}
        >
          {day.date()}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {visibleEvents.map((evt) => (
          <EventCard key={evt._id || evt.id} event={evt} onClick={handleEventClick} />
        ))}

        {hiddenCount > 0 && (
          <Typography
            variant="caption"
            onClick={handleMoreClick}
            sx={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--google-blue-dark)',
              cursor: 'pointer',
              mt: 'auto',
              px: 0.5,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            +{hiddenCount} more
          </Typography>
        )}
      </Box>

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { p: 1.5, minWidth: 200, maxWidth: 280, borderRadius: 'var(--radius-md)' },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {day.format('dddd, MMM D')}
          </Typography>
          <Button size="small" onClick={() => dispatch(openCreateEventDialog(dateString))}>
            + Add
          </Button>
        </Box>
        <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {events.map((evt) => (
            <ListItem key={evt._id || evt.id} disablePadding>
              <EventCard
                event={evt}
                onClick={(e, selectedEvt) => {
                  handleClosePopover();
                  handleEventClick(e, selectedEvt);
                }}
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  );
};
