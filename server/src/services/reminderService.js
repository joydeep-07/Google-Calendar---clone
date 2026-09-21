import cron from 'node-cron';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { sendReminderEmail, initEmailService } from './emailService.js';
import dayjs from 'dayjs';

export const startReminderScheduler = () => {
  initEmailService();

  // Run every minute: '* * * * *'
  cron.schedule('* * * * *', async () => {
    try {
      const now = dayjs();
      
      // Look for events starting within the next 24 hours that have unsent reminders
      const lookaheadLimit = now.add(25, 'hour').toDate();
      const lookbehindLimit = now.subtract(10, 'minute').toDate();

      const events = await Event.find({
        start: { $gte: lookbehindLimit, $lte: lookaheadLimit },
        'reminders.sent': false,
      }).populate('userId', 'email name');

      for (const event of events) {
        if (!event.userId || !event.userId.email) continue;

        let modified = false;

        for (const reminder of event.reminders) {
          if (reminder.sent) continue;

          const reminderTriggerTime = dayjs(event.start).subtract(reminder.minutesBefore, 'minute');

          // Check if now is past or at the reminder trigger time, but not way past event start
          if (now.isSameOrAfter ? now.isSameOrAfter(reminderTriggerTime) : (now.isAfter(reminderTriggerTime) || now.isSame(reminderTriggerTime))) {
            if (now.isBefore(dayjs(event.end))) {
              console.log(`[Reminder Triggered] Sending reminder for "${event.title}" to ${event.userId.email} (${reminder.minutesBefore}m before)`);
              
              if (event.emailNotification) {
                await sendReminderEmail({
                  to: event.userId.email,
                  userTitle: event.userId.name,
                  eventTitle: event.title,
                  description: event.description,
                  start: event.start,
                  end: event.end,
                  location: event.location,
                });
              }

              reminder.sent = true;
              reminder.sentAt = new Date();
              modified = true;
            }
          }
        }

        if (modified) {
          await event.save();
        }
      }
    } catch (error) {
      console.error('[Reminder Cron Error]', error.message);
    }
  });

  console.log('[Reminder Scheduler] Cron job initialized (running every 60 seconds)');
};
