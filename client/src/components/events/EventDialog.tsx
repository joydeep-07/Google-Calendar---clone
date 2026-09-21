import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { EventForm } from './EventForm';
import { EventDetails } from './EventDetails';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import {
  closeEventDialog,
  createNewEvent,
  updateExistingEvent,
  deleteExistingEvent,
  openEditEventDialog,
} from '../../redux/eventSlice';
import type { IEventFormData } from '../../types/event';

export const EventDialog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isEventDialogOpen,
    eventDialogMode,
    selectedEvent,
    selectedDate,
    isLoading,
  } = useSelector((state: RootState) => state.events);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleClose = () => {
    dispatch(closeEventDialog());
  };

  const handleFormSubmit = async (formData: IEventFormData) => {
    if (eventDialogMode === 'edit' && selectedEvent) {
      await dispatch(
        updateExistingEvent({
          id: selectedEvent._id || selectedEvent.id || '',
          formData,
        })
      );
    } else {
      await dispatch(createNewEvent(formData));
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEvent) {
      setConfirmDeleteOpen(false);
      await dispatch(deleteExistingEvent(selectedEvent._id || selectedEvent.id || ''));
    }
  };

  return (
    <>
      <Dialog
        open={isEventDialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { borderRadius: 'var(--radius-lg)', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          {eventDialogMode === 'create' && 'Create New Event'}
          {eventDialogMode === 'edit' && 'Edit Event'}
          {eventDialogMode === 'view' && ''}

          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          {eventDialogMode === 'view' && selectedEvent ? (
            <EventDetails
              event={selectedEvent}
              onEdit={() => dispatch(openEditEventDialog(selectedEvent))}
              onDelete={() => setConfirmDeleteOpen(true)}
              onClose={handleClose}
            />
          ) : (
            <EventForm
              initialEvent={selectedEvent}
              defaultDate={selectedDate}
              onSubmit={handleFormSubmit}
              onCancel={handleClose}
              isSubmitting={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete Event?"
        message={`Are you sure you want to delete "${selectedEvent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
};
