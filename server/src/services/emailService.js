import nodemailer from 'nodemailer';
import dayjs from 'dayjs';

let transporter = null;

export const initEmailService = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[Email Service] SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS). Email notifications will log reminders without sending emails.');
    return;
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  console.log(`[Email Service] Configured SMTP transporter for ${host}:${port}`);
};

export const sendReminderEmail = async ({ to, userTitle, eventTitle, description, start, end, location }) => {
  const mailFrom = process.env.MAIL_FROM || '"Google Calendar Clone" <noreply@calendarclone.local>';

  const formattedStart = dayjs(start).format('dddd, MMMM D, YYYY [at] h:mm A');
  const formattedEnd = dayjs(end).format('h:mm A');

  const htmlContent = `
    <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e8eaed; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #1a73e8; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1a73e8; margin: 0; font-size: 22px;">📅 Google Calendar Reminder</h2>
      </div>

      <p style="color: #3c4043; font-size: 16px;">Hello ${userTitle || 'User'},</p>
      <p style="color: #3c4043; font-size: 15px;">This is a reminder for your upcoming event:</p>

      <div style="background-color: #f8fafd; border-left: 4px solid #1a73e8; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin: 0 0 8px 0; color: #202124; font-size: 18px;">${eventTitle}</h3>
        <p style="margin: 4px 0; color: #5f6368; font-size: 14px;"><strong>⏰ Time:</strong> ${formattedStart} – ${formattedEnd}</p>
        ${location ? `<p style="margin: 4px 0; color: #5f6368; font-size: 14px;"><strong>📍 Location:</strong> ${location}</p>` : ''}
        ${description ? `<p style="margin: 4px 0; color: #5f6368; font-size: 14px;"><strong>📝 Description:</strong> ${description}</p>` : ''}
      </div>

      <p style="color: #80868b; font-size: 12px; margin-top: 30px; text-align: center;">
        Sent automatically by Google Calendar Clone. Please do not reply directly to this email.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Notice (SMTP Not Configured)] Would send email to "${to}" for event "${eventTitle}" starting at ${formattedStart}`);
    return { success: false, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: mailFrom,
      to,
      subject: `Reminder: ${eventTitle} @ ${dayjs(start).format('h:mm A')}`,
      html: htmlContent,
    });
    console.log(`[Email Sent] Reminder email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send reminder email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
