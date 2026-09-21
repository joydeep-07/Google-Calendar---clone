import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { Repeat as RepeatIcon } from '@mui/icons-material';
import type { IEvent } from '../../types/event';
import dayjs from 'dayjs';

interface EventCardProps {
  event: IEvent;
  onClick: (e: React.MouseEvent, event: IEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isAllDay = event.allDay;
  const timeStr = isAllDay ? '' : dayjs(event.start).format('h:mm A');
  const bgColor = event.color || '#1a73e8';

  const isRecurring = event.recurrence && event.recurrence.enabled && event.recurrence.frequency !== 'NONE';

  return (
    <Tooltip title={`${event.title} (${isAllDay ? 'All-day' : `${dayjs(event.start).format('h:mm A')} - ${dayjs(event.end).format('h:mm A')}`}) ${event.location ? `📍 ${event.location}` : ''}`}>
      <Box
        onClick={(e) => onClick(e, event)}
        sx={{
          backgroundColor: isAllDay ? bgColor : `${bgColor}18`,
          borderLeft: isAllDay ? 'none' : `4px solid ${bgColor}`,
          color: isAllDay ? '#ffffff' : 'var(--text-primary)',
          borderRadius: '4px',
          px: 0.8,
          py: 0.3,
          mb: 0.4,
          fontSize: '11px',
          lineHeight: '1.3',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          transition: 'var(--transition-fast)',
          '&:hover': {
            filter: 'brightness(0.95)',
            boxShadow: 'var(--shadow-sm)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflow: 'hidden' }}>
          {!isAllDay && (
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '10px', flexShrink: 0 }}>
              {timeStr}
            </Typography>
          )}
          <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.title}
          </Typography>
        </Box>

        {isRecurring && (
          <RepeatIcon sx={{ fontSize: 11, flexShrink: 0, opacity: 0.8 }} />
        )}
      </Box>
    </Tooltip>
  );
};
