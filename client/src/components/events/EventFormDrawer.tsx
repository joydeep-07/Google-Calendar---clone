import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { EventForm } from "./EventForm"; // Adjust import path as needed
import type { IEvent, IEventFormData } from "../../types/event";

interface EventFormDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialEvent?: IEvent | null;
  defaultDate?: string;
  onSubmit: (formData: IEventFormData) => void;
  isSubmitting?: boolean;
  triggerButtonText?: string;
}

export const EventFormDrawer: React.FC<EventFormDrawerProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  initialEvent,
  defaultDate,
  onSubmit,
  isSubmitting = false,
  triggerButtonText = "Create Task",
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (externalOnClose && !open) {
      externalOnClose();
    }
    setInternalIsOpen(open);
  };

  const handleFormSubmit = (formData: IEventFormData) => {
    onSubmit(formData);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button (Rendered only if uncontrolled from outside) */}
      {externalIsOpen === undefined && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            height: "48px",
            borderRadius: "24px",
            px: 3,
            textTransform: "none",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              borderColor: "var(--google-blue-light, #1a73e8)",
              backgroundColor: "var(--google-blue-light, #1a73e8)",
              color: "var(--google-blue-dark, #fff)",
            },
            transition: "all 200ms ease-out",
          }}
        >
          {triggerButtonText}
        </Button>
      )}

      {/* Drawer Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
              display: "flex",
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(2px)",
              }}
            />

            {/* Drawer Panel - Left Side (60% width, sliding motion) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "relative",
                width: "60%",
                height: "100%",
                backgroundColor: "#ffffff",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
             

              {/* Scrollable Content Area */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  px: 3,
                  py: 2,
                }}
              >
                <EventForm
                  initialEvent={initialEvent}
                  defaultDate={defaultDate}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsOpen(false)}
                  isSubmitting={isSubmitting}
                />
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventFormDrawer;
