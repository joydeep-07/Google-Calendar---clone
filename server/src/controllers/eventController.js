import { Event } from '../models/Event.js';
import { expandRecurringEvents } from '../services/recurrenceService.js';
import { getIO } from '../sockets/socket.js';
import dayjs from 'dayjs';

export const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: 'start and end query parameters (YYYY-MM-DD) are required',
      });
    }

    const rangeStart = dayjs(start).startOf('day').toDate();
    const rangeEnd = dayjs(end).endOf('day').toDate();

    // Query non-recurring events within range OR any active recurring event
    const rawEvents = await Event.find({
      userId: req.user.id,
      $or: [
        { start: { $gte: rangeStart, $lte: rangeEnd } },
        { end: { $gte: rangeStart, $lte: rangeEnd } },
        { start: { $lte: rangeStart }, end: { $gte: rangeEnd } },
        { 'recurrence.enabled': true },
      ],
    }).sort({ start: 1 });

    const expandedEvents = expandRecurringEvents(rawEvents, start, end);

    return res.status(200).json({
      success: true,
      count: expandedEvents.length,
      data: expandedEvents,
    });
  } catch (error) {
    console.error('[Get Events Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Strict ownership verification
    if (event.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this event.',
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message,
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description = '',
      start,
      end,
      allDay = false,
      location = '',
      category = 'Personal',
      color = '#1a73e8',
      recurrence = { enabled: false, frequency: 'NONE', interval: 1, daysOfWeek: [], endDate: null },
      reminders = [],
      emailNotification = false,
    } = req.body;

    // Backend validations
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Event title is required',
      });
    }

    if (!start || !end || isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Valid start and end dates are required',
      });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date and time cannot be before start date and time',
      });
    }

    // Format reminders array
    const formattedReminders = Array.isArray(reminders)
      ? reminders.map((r) => ({
          minutesBefore: typeof r === 'number' ? r : (r.minutesBefore || 0),
          sent: false,
        }))
      : [];

    const newEvent = await Event.create({
      userId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      start: startDate,
      end: endDate,
      allDay,
      location: location.trim(),
      category,
      color,
      recurrence,
      reminders: formattedReminders,
      emailNotification,
    });

    // Real-time notification via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${req.user.id}`).emit('event:created', newEvent);
      }
    } catch (socketErr) {
      console.warn('[Socket Broadcast Warning]', socketErr.message);
    }

    return res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created successfully',
    });
  } catch (error) {
    console.error('[Create Event Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Handle occurrence editing or master event editing
    let eventId = id;
    if (id.includes('_occ_')) {
      eventId = id.split('_occ_')[0];
    }

    let event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Strict ownership verification
    if (event.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to edit this event.',
      });
    }

    const {
      title,
      description,
      start,
      end,
      allDay,
      location,
      category,
      color,
      recurrence,
      reminders,
      emailNotification,
    } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    if (start && end && new Date(end) < new Date(start)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date',
      });
    }

    if (title !== undefined) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (start !== undefined) event.start = new Date(start);
    if (end !== undefined) event.end = new Date(end);
    if (allDay !== undefined) event.allDay = allDay;
    if (location !== undefined) event.location = location.trim();
    if (category !== undefined) event.category = category;
    if (color !== undefined) event.color = color;
    if (recurrence !== undefined) event.recurrence = recurrence;
    if (emailNotification !== undefined) event.emailNotification = emailNotification;

    if (reminders !== undefined && Array.isArray(reminders)) {
      event.reminders = reminders.map((r) => ({
        minutesBefore: typeof r === 'number' ? r : (r.minutesBefore || 0),
        sent: false,
      }));
    }

    await event.save();

    // Broadcast update via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${req.user.id}`).emit('event:updated', event);
      }
    } catch (socketErr) {
      console.warn('[Socket Broadcast Warning]', socketErr.message);
    }

    return res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('[Update Event Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let eventId = id;
    if (id.includes('_occ_')) {
      eventId = id.split('_occ_')[0];
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Strict ownership check
    if (event.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this event.',
      });
    }

    await Event.findByIdAndDelete(eventId);

    // Broadcast deletion via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${req.user.id}`).emit('event:deleted', eventId);
      }
    } catch (socketErr) {
      console.warn('[Socket Broadcast Warning]', socketErr.message);
    }

    return res.status(200).json({
      success: true,
      data: { id: eventId },
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('[Delete Event Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message,
    });
  }
};
