import React from 'react';
import { Box } from '@mui/material';
import { CalendarCell } from './CalendarCell';
import type { IEvent } from '../../types/event';
import dayjs from 'dayjs';

interface CalendarGridProps {
  currentDate: dayjs.Dayjs;
  events: IEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events }) => {
  const startOfMonth = currentDate.startOf('month');
  const startDayOfWeek = startOfMonth.day();
  const startDate = startOfMonth.subtract(startDayOfWeek, 'day');

  const totalDays = startDayOfWeek + currentDate.daysInMonth() > 35 ? 42 : 35;

  const calendarDays = Array.from({ length: totalDays }).map((_, index) => {
    return startDate.add(index, 'day');
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: `repeat(${totalDays / 7}, 1fr)`,
        flexGrow: 1,
        height: 'calc(100% - var(--calendar-header-height))',
        backgroundColor: 'var(--bg-primary)',
        overflowY: 'auto',
      }}
    >
      {calendarDays.map((day, idx) => {
        const dateStr = day.format('YYYY-MM-DD');

        const dayEvents = events.filter((evt) => {
          const evtStartStr = dayjs(evt.start).format('YYYY-MM-DD');
          return evtStartStr === dateStr;
        });

        const isCurrentMonth = day.month() === currentDate.month();
        const isToday = day.isSame(dayjs(), 'day');

        return (
          <CalendarCell
            key={idx}
            day={day}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            events={dayEvents}
          />
        );
      })}
    </Box>
  );
};
