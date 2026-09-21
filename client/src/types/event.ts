export type EventCategory = 'Work' | 'Personal' | 'Study' | 'Meeting' | 'Birthday' | 'Holiday' | 'Important';

export type RecurrenceFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface IRecurrence {
  enabled: boolean;
  frequency: RecurrenceFrequency;
  interval: number;
  daysOfWeek: number[]; // 0 for Sunday, 1 for Monday, etc.
  endDate?: string | null;
}

export interface IReminder {
  _id?: string;
  minutesBefore: number; // 0, 5, 10, 15, 30, 60, 1440
  sent?: boolean;
  sentAt?: string;
}

export interface IEvent {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  description: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay: boolean;
  location: string;
  category: EventCategory;
  color: string;
  recurrence: IRecurrence;
  reminders: IReminder[];
  emailNotification: boolean;
  isOccurrence?: boolean;
  parentEventId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEventFormData {
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  location: string;
  category: EventCategory;
  color: string;
  recurrence: IRecurrence;
  reminders: number[]; // array of minutesBefore values
  emailNotification: boolean;
}
