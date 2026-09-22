import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Notes as DescriptionIcon,
  Repeat as RepeatIcon,
  Notifications as ReminderIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import type {
  IEvent,
  IEventFormData,
  EventCategory,
  RecurrenceFrequency,
} from "../../types/event";
import dayjs from "dayjs";

interface EventFormProps {
  initialEvent?: IEvent | null;
  defaultDate?: string;
  onSubmit: (formData: IEventFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORIES: EventCategory[] = [
  "Work",
  "Personal",
  "Study",
  "Meeting",
  "Birthday",
  "Holiday",
  "Important",
];

const PRESET_COLORS = [
  { name: "Blue", hex: "#1a73e8" },
  { name: "Green", hex: "#188038" },
  { name: "Red", hex: "#d93025" },
  { name: "Yellow", hex: "#f9ab00" },
  { name: "Purple", hex: "#9334e6" },
  { name: "Orange", hex: "#e8710a" },
  { name: "Pink", hex: "#d01884" },
  { name: "Cyan", hex: "#007b83" },
];

const REMINDER_OPTIONS = [
  { label: "At time of event", minutes: 0 },
  { label: "5 minutes before", minutes: 5 },
  { label: "10 minutes before", minutes: 10 },
  { label: "15 minutes before", minutes: 15 },
  { label: "30 minutes before", minutes: 30 },
  { label: "1 hour before", minutes: 60 },
  { label: "1 day before", minutes: 1440 },
];

export const EventForm: React.FC<EventFormProps> = ({
  initialEvent,
  defaultDate,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allDay, setAllDay] = useState(false);

  const [startDate, setStartDate] = useState(
    defaultDate || dayjs().format("YYYY-MM-DD"),
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(
    defaultDate || dayjs().format("YYYY-MM-DD"),
  );
  const [endTime, setEndTime] = useState("10:00");

  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("Personal");
  const [color, setColor] = useState("#1a73e8");

  const [recEnabled, setRecEnabled] = useState(false);
  const [recFrequency, setRecFrequency] =
    useState<RecurrenceFrequency>("WEEKLY");
  const [recInterval, setRecInterval] = useState(1);
  const [recDaysOfWeek, setRecDaysOfWeek] = useState<number[]>([1]);
  const [recEndDate, setRecEndDate] = useState("");

  const [selectedReminders, setSelectedReminders] = useState<number[]>([15]);
  const [emailNotification, setEmailNotification] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || "");
      setDescription(initialEvent.description || "");
      setAllDay(initialEvent.allDay || false);

      const s = dayjs(initialEvent.start);
      const e = dayjs(initialEvent.end);

      setStartDate(s.format("YYYY-MM-DD"));
      setStartTime(s.format("HH:mm"));
      setEndDate(e.format("YYYY-MM-DD"));
      setEndTime(e.format("HH:mm"));

      setLocation(initialEvent.location || "");
      setCategory(initialEvent.category || "Personal");
      setColor(initialEvent.color || "#1a73e8");

      if (initialEvent.recurrence) {
        setRecEnabled(initialEvent.recurrence.enabled || false);
        setRecFrequency(initialEvent.recurrence.frequency || "NONE");
        setRecInterval(initialEvent.recurrence.interval || 1);
        setRecDaysOfWeek(initialEvent.recurrence.daysOfWeek || []);
        setRecEndDate(
          initialEvent.recurrence.endDate
            ? dayjs(initialEvent.recurrence.endDate).format("YYYY-MM-DD")
            : "",
        );
      }

      if (initialEvent.reminders && initialEvent.reminders.length > 0) {
        setSelectedReminders(
          initialEvent.reminders.map((r) => r.minutesBefore),
        );
      }
      setEmailNotification(initialEvent.emailNotification || false);
    }
  }, [initialEvent]);

  const handleToggleDayOfWeek = (dayNum: number) => {
    if (recDaysOfWeek.includes(dayNum)) {
      setRecDaysOfWeek(recDaysOfWeek.filter((d) => d !== dayNum));
    } else {
      setRecDaysOfWeek([...recDaysOfWeek, dayNum]);
    }
  };

  const handleToggleReminder = (minutes: number) => {
    if (selectedReminders.includes(minutes)) {
      setSelectedReminders(selectedReminders.filter((m) => m !== minutes));
    } else {
      setSelectedReminders([...selectedReminders, minutes]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Event title is required");
      return;
    }

    const startISO = allDay
      ? dayjs(startDate).startOf("day").toISOString()
      : dayjs(`${startDate}T${startTime}`).toISOString();

    const endISO = allDay
      ? dayjs(endDate).endOf("day").toISOString()
      : dayjs(`${endDate}T${endTime}`).toISOString();

    if (dayjs(endISO).isBefore(dayjs(startISO))) {
      setFormError("End time cannot be before start time");
      return;
    }

    const formData: IEventFormData = {
      title: title.trim(),
      description: description.trim(),
      start: startISO,
      end: endISO,
      allDay,
      location: location.trim(),
      category,
      color,
      recurrence: {
        enabled: recEnabled && recFrequency !== "NONE",
        frequency: recEnabled ? recFrequency : "NONE",
        interval: recInterval,
        daysOfWeek: recFrequency === "WEEKLY" ? recDaysOfWeek : [],
        endDate: recEndDate
          ? dayjs(recEndDate).endOf("day").toISOString()
          : null,
      },
      reminders: selectedReminders,
      emailNotification,
    };

    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
    >
      {formError && (
        <Typography
          color="error"
          variant="body2"
          sx={{ backgroundColor: "var(--error-bg)", p: 1.5, borderRadius: 1 }}
        >
          {formError}
        </Typography>
      )}

      <TextField
        placeholder="Add title"
        variant="standard"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        slotProps={{
          htmlInput: {
            style: {
              fontSize: "22px",
              fontWeight: 500,
              fontFamily: "var(--font-google)",
            },
          },
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <FormControlLabel
          control={
            <Switch
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              color="primary"
            />
          }
          label={<Typography variant="body2">All day event</Typography>}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: allDay ? "1fr 1fr" : "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {!allDay && (
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              size="small"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}

          <TextField
            label="End Date"
            type="date"
            fullWidth
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {!allDay && (
            <TextField
              label="End Time"
              type="time"
              fullWidth
              size="small"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RepeatIcon color="action" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Repeat / Recurrence
            </Typography>
          </Box>
          <Switch
            checked={recEnabled}
            onChange={(e) => setRecEnabled(e.target.checked)}
          />
        </Box>

        {recEnabled && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={recFrequency}
                  label="Frequency"
                  onChange={(e) =>
                    setRecFrequency(e.target.value as RecurrenceFrequency)
                  }
                >
                  <MenuItem value="DAILY">Daily</MenuItem>
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                  <MenuItem value="YEARLY">Yearly</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Interval"
                type="number"
                size="small"
                fullWidth
                value={recInterval}
                onChange={(e) =>
                  setRecInterval(Math.max(1, Number(e.target.value)))
                }
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Box>

            {recFrequency === "WEEKLY" && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  Repeat on days:
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {["S", "M", "T", "W", "T", "F", "S"].map(
                    (dayChar, dayIdx) => {
                      const selected = recDaysOfWeek.includes(dayIdx);
                      return (
                        <Chip
                          key={dayIdx}
                          label={dayChar}
                          clickable
                          onClick={() => handleToggleDayOfWeek(dayIdx)}
                          color={selected ? "primary" : "default"}
                          variant={selected ? "filled" : "outlined"}
                          size="small"
                        />
                      );
                    },
                  )}
                </Box>
              </Box>
            )}

            <TextField
              label="End Repeat Date (Optional)"
              type="date"
              size="small"
              fullWidth
              value={recEndDate}
              onChange={(e) => setRecEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => {
              const cat = e.target.value as EventCategory;
              setCategory(cat);
              const matchingColor = PRESET_COLORS.find(
                (c) => c.name.toLowerCase() === cat.toLowerCase(),
              );
              if (matchingColor) setColor(matchingColor.hex);
            }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            Event Color
          </Typography>
          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
            {PRESET_COLORS.map((c) => (
              <Box
                key={c.hex}
                onClick={() => setColor(c.hex)}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  backgroundColor: c.hex,
                  cursor: "pointer",
                  border: color === c.hex ? "2px solid #202124" : "none",
                  boxShadow: color === c.hex ? "0 0 0 2px #ffffff" : "none",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <TextField
        label="Location"
        placeholder="Add location"
        fullWidth
        size="small"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <LocationIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
            ),
          },
        }}
      />

      <TextField
        label="Description"
        placeholder="Add description or notes"
        multiline
        rows={3}
        fullWidth
        size="small"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <DescriptionIcon
                color="action"
                sx={{ mr: 1, mt: 1, fontSize: 20 }}
              />
            ),
          },
        }}
      />

      <Box
        sx={{
          borderTop: "1px solid var(--border-primary)",
          pt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReminderIcon color="action" fontSize="small" /> Reminders &
          Notifications
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {REMINDER_OPTIONS.map((opt) => {
            const isSel = selectedReminders.includes(opt.minutes);
            return (
              <Chip
                key={opt.minutes}
                label={opt.label}
                clickable
                onClick={() => handleToggleReminder(opt.minutes)}
                color={isSel ? "primary" : "default"}
                variant={isSel ? "filled" : "outlined"}
                size="small"
              />
            );
          })}
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={emailNotification}
              onChange={(e) => setEmailNotification(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Send email notifications for reminders
              </Typography>
            </Box>
          }
        />
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}
      >
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Event"}
        </Button>
      </Box>
    </Box>
  );
};
