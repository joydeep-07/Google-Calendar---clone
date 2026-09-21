import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IEvent, IEventFormData, EventCategory } from '../types/event';
import { eventApi } from '../services/eventApi';
import dayjs from 'dayjs';

interface EventState {
  events: IEvent[];
  selectedDate: string;
  currentDate: string;
  selectedEvent: IEvent | null;
  isEventDialogOpen: boolean;
  eventDialogMode: 'create' | 'edit' | 'view';
  activeCategoryFilters: EventCategory[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  notificationMessage: string | null;
}

const allCategories: EventCategory[] = ['Work', 'Personal', 'Study', 'Meeting', 'Birthday', 'Holiday', 'Important'];

const initialState: EventState = {
  events: [],
  selectedDate: dayjs().format('YYYY-MM-DD'),
  currentDate: dayjs().toISOString(),
  selectedEvent: null,
  isEventDialogOpen: false,
  eventDialogMode: 'create',
  activeCategoryFilters: allCategories,
  searchQuery: '',
  isLoading: false,
  error: null,
  notificationMessage: null,
};

export const fetchEventsForRange = createAsyncThunk(
  'events/fetchForRange',
  async ({ start, end }: { start: string; end: string }, { rejectWithValue }) => {
    try {
      const res = await eventApi.getEvents(start, end);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createNewEvent = createAsyncThunk(
  'events/create',
  async (formData: IEventFormData, { rejectWithValue }) => {
    try {
      const res = await eventApi.createEvent(formData);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateExistingEvent = createAsyncThunk(
  'events/update',
  async ({ id, formData }: { id: string; formData: Partial<IEventFormData> }, { rejectWithValue }) => {
    try {
      const res = await eventApi.updateEvent(id, formData);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteExistingEvent = createAsyncThunk(
  'events/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await eventApi.deleteEvent(id);
      return { id, res };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete event');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    openCreateEventDialog: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.selectedDate = action.payload;
      }
      state.selectedEvent = null;
      state.eventDialogMode = 'create';
      state.isEventDialogOpen = true;
    },
    openEditEventDialog: (state, action: PayloadAction<IEvent>) => {
      state.selectedEvent = action.payload;
      state.eventDialogMode = 'edit';
      state.isEventDialogOpen = true;
    },
    openViewEventDialog: (state, action: PayloadAction<IEvent>) => {
      state.selectedEvent = action.payload;
      state.eventDialogMode = 'view';
      state.isEventDialogOpen = true;
    },
    closeEventDialog: (state) => {
      state.isEventDialogOpen = false;
      state.selectedEvent = null;
    },
    toggleCategoryFilter: (state, action: PayloadAction<EventCategory>) => {
      const category = action.payload;
      if (state.activeCategoryFilters.includes(category)) {
        state.activeCategoryFilters = state.activeCategoryFilters.filter((c) => c !== category);
      } else {
        state.activeCategoryFilters.push(category);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearNotification: (state) => {
      state.notificationMessage = null;
    },
    setNotification: (state, action: PayloadAction<string>) => {
      state.notificationMessage = action.payload;
    },

    socketEventCreated: (state, action: PayloadAction<IEvent>) => {
      const newEvt = action.payload;
      const exists = state.events.some((e) => e._id === newEvt._id);
      if (!exists) {
        state.events.push(newEvt);
      }
    },
    socketEventUpdated: (state, action: PayloadAction<IEvent>) => {
      const updatedEvt = action.payload;
      const index = state.events.findIndex((e) => e._id === updatedEvt._id || e.parentEventId === updatedEvt._id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...updatedEvt };
      }
    },
    socketEventDeleted: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      state.events = state.events.filter((e) => e._id !== deletedId && e.parentEventId !== deletedId);
      if (state.selectedEvent && (state.selectedEvent._id === deletedId || state.selectedEvent.parentEventId === deletedId)) {
        state.isEventDialogOpen = false;
        state.selectedEvent = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsForRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventsForRange.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEventsForRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const newEvt = action.payload.data;
        const exists = state.events.some((e) => e._id === newEvt._id);
        if (!exists) {
          state.events.push(newEvt);
        }
        state.isEventDialogOpen = false;
        state.notificationMessage = 'Event created successfully';
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExistingEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedEvt = action.payload.data;
        state.events = state.events.map((e) =>
          e._id === updatedEvt._id || e.parentEventId === updatedEvt._id ? updatedEvt : e
        );
        state.isEventDialogOpen = false;
        state.notificationMessage = 'Event updated successfully';
      })
      .addCase(updateExistingEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExistingEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.id;
        state.events = state.events.filter((e) => e._id !== deletedId && e.parentEventId !== deletedId);
        state.isEventDialogOpen = false;
        state.selectedEvent = null;
        state.notificationMessage = 'Event deleted successfully';
      })
      .addCase(deleteExistingEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedDate,
  setCurrentDate,
  openCreateEventDialog,
  openEditEventDialog,
  openViewEventDialog,
  closeEventDialog,
  toggleCategoryFilter,
  setSearchQuery,
  clearNotification,
  setNotification,
  socketEventCreated,
  socketEventUpdated,
  socketEventDeleted,
} = eventSlice.actions;

export default eventSlice.reducer;
