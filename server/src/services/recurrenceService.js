import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Expands recurring events into individual occurrences for a requested date range.
 * Does NOT persist occurrences to database.
 * 
 * @param {Array} events - List of Mongoose event documents
 * @param {Date|String} rangeStartStr - Start of query window
 * @param {Date|String} rangeEndStr - End of query window
 * @returns {Array} Expanded list of events including parent events and virtual occurrences
 */
export const expandRecurringEvents = (events, rangeStartStr, rangeEndStr) => {
  const rangeStart = dayjs(rangeStartStr).startOf('day');
  const rangeEnd = dayjs(rangeEndStr).endOf('day');

  const result = [];

  for (const eventDoc of events) {
    const event = eventDoc.toObject ? eventDoc.toObject() : eventDoc;

    // Non-recurring event: add if within range
    if (!event.recurrence || !event.recurrence.enabled || event.recurrence.frequency === 'NONE') {
      const eventStart = dayjs(event.start);
      const eventEnd = dayjs(event.end);
      if (eventEnd.isAfter(rangeStart) && eventStart.isBefore(rangeEnd)) {
        result.push(event);
      }
      continue;
    }

    // Recurring event processing
    const { frequency, interval = 1, daysOfWeek = [], endDate: recEndDateStr } = event.recurrence;
    const origStart = dayjs(event.start);
    const origEnd = dayjs(event.end);
    const durationMs = origEnd.diff(origStart);

    let recCutoff = recEndDateStr ? dayjs(recEndDateStr).endOf('day') : null;
    let maxRangeEnd = rangeEnd;
    if (recCutoff && recCutoff.isBefore(maxRangeEnd)) {
      maxRangeEnd = recCutoff;
    }

    let curr = origStart;
    let safetyCounter = 0;
    const MAX_ITERATIONS = 500;

    if (frequency === 'DAILY') {
      while ((curr.isBefore(maxRangeEnd) || curr.isSame(maxRangeEnd)) && safetyCounter < MAX_ITERATIONS) {
        const occEnd = curr.add(durationMs, 'millisecond');
        if ((curr.isAfter(rangeStart) || curr.isSame(rangeStart)) || (occEnd.isAfter(rangeStart) && curr.isBefore(rangeEnd))) {
          result.push(createOccurrenceObject(event, curr, occEnd));
        }
        curr = curr.add(interval, 'day');
        safetyCounter++;
      }
    } else if (frequency === 'WEEKLY') {
      // If daysOfWeek is specified (e.g. [1, 3] for Mon/Wed), step day by day or week by week
      const targetDays = daysOfWeek.length > 0 ? daysOfWeek : [origStart.day()];
      
      let weekStart = origStart.startOf('week');
      while (weekStart.isBefore(maxRangeEnd) && safetyCounter < MAX_ITERATIONS) {
        for (const dayNum of targetDays) {
          const occStart = weekStart.add(dayNum, 'day').hour(origStart.hour()).minute(origStart.minute()).second(origStart.second());
          
          if (occStart.isBefore(origStart)) continue; // Don't generate before original event start
          if (occStart.isAfter(maxRangeEnd)) continue;

          const occEnd = occStart.add(durationMs, 'millisecond');
          if (occEnd.isAfter(rangeStart) && occStart.isBefore(rangeEnd)) {
            result.push(createOccurrenceObject(event, occStart, occEnd));
          }
        }

        weekStart = weekStart.add(interval, 'week');
        safetyCounter++;
      }
    } else if (frequency === 'MONTHLY') {
      while ((curr.isBefore(maxRangeEnd) || curr.isSame(maxRangeEnd)) && safetyCounter < MAX_ITERATIONS) {
        const occEnd = curr.add(durationMs, 'millisecond');
        if (occEnd.isAfter(rangeStart) && curr.isBefore(rangeEnd)) {
          result.push(createOccurrenceObject(event, curr, occEnd));
        }
        curr = curr.add(interval, 'month');
        safetyCounter++;
      }
    } else if (frequency === 'YEARLY') {
      while ((curr.isBefore(maxRangeEnd) || curr.isSame(maxRangeEnd)) && safetyCounter < MAX_ITERATIONS) {
        const occEnd = curr.add(durationMs, 'millisecond');
        if (occEnd.isAfter(rangeStart) && curr.isBefore(rangeEnd)) {
          result.push(createOccurrenceObject(event, curr, occEnd));
        }
        curr = curr.add(interval, 'year');
        safetyCounter++;
      }
    }
  }

  return result;
};

const createOccurrenceObject = (parentEvent, occStart, occEnd) => {
  const isOriginal = dayjs(parentEvent.start).isSame(occStart, 'minute');
  return {
    ...parentEvent,
    _id: isOriginal ? parentEvent._id : `${parentEvent._id}_occ_${occStart.valueOf()}`,
    id: isOriginal ? parentEvent._id : `${parentEvent._id}_occ_${occStart.valueOf()}`,
    start: occStart.toISOString(),
    end: occEnd.toISOString(),
    isOccurrence: !isOriginal,
    parentEventId: parentEvent._id,
  };
};
