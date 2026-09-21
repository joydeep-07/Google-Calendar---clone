import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    minutesBefore: {
      type: Number,
      required: true,
      // 0 = at event time, 5 = 5m before, 10 = 10m before, 15 = 15m, 30 = 30m, 60 = 1h, 1440 = 1d
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Study', 'Meeting', 'Birthday', 'Holiday', 'Important'],
      default: 'Personal',
    },
    color: {
      type: String,
      default: '#1a73e8',
    },
    recurrence: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        default: 'NONE',
      },
      interval: {
        type: Number,
        default: 1,
        min: 1,
      },
      daysOfWeek: {
        type: [Number], // 0 for Sun, 1 for Mon, etc.
        default: [],
      },
      endDate: {
        type: Date,
        default: null,
      },
    },
    reminders: [reminderSchema],
    emailNotification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user date range queries
eventSchema.index({ userId: 1, start: 1, end: 1 });

export const Event = mongoose.model('Event', eventSchema);
