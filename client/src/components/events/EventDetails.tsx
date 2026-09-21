import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Notes as DescriptionIcon,
  Repeat as RepeatIcon,
  Notifications as ReminderIcon,
  Label as CategoryIcon,
} from '@mui/icons-material';
import type { IEvent } from '../../types/event';
import dayjs from 'dayjs';

interface EventDetailsProps {
  event: IEvent;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onEdit,
  onDelete,
  onClose,
}) => {
  const isAllDay = event.allDay;
  const startDateStr = dayjs(event.start).format('dddd, MMMM D, YYYY');
  const startTimeStr = isAllDay ? 'All-day' : `${dayjs(event.start).format('h:mm A')} – ${dayjs(event.end).format('h:mm A')}`;

  const isRecurring = event.recurrence && event.recurrence.enabled && event.recurrence.frequency !== 'NONE';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Edit event">
          <IconButton onClick={onEdit} size="small" sx={{ color: 'var(--text-secondary)' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete event">
          <IconButton onClick={onDelete} size="small" sx={{ color: 'var(--google-red)' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-secondary)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '4px',
            backgroundColor: event.color || '#1a73e8',
            mt: 0.8,
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-google)', fontWeight: 600, lineHeight: 1.2 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {startDateStr}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <TimeIcon color="action" fontSize="small" />
        <Typography variant="body2">{startTimeStr}</Typography>
      </Box>

      {isRecurring && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RepeatIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Repeats {event.recurrence.frequency.toLowerCase()} (every {event.recurrence.interval} {event.recurrence.frequency.toLowerCase().replace('ly', '')})
          </Typography>
        </Box>
      )}

      {event.location && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocationIcon color="action" fontSize="small" />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <CategoryIcon color="action" fontSize="small" />
        <Chip label={event.category} size="small" sx={{ backgroundColor: `${event.color}20`, color: event.color, fontWeight: 600 }} />
      </Box>

      {event.reminders && event.reminders.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ReminderIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {event.reminders.map((r) => `${r.minutesBefore}m before`).join(', ')}
            {event.emailNotification ? ' (Email enabled)' : ''}
          </Typography>
        </Box>
      )}

      {event.description && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 1 }}>
          <DescriptionIcon color="action" fontSize="small" sx={{ mt: 0.3 }} />
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
