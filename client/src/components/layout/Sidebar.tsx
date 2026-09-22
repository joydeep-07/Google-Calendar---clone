import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { AddIcCallOutlined, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  openCreateEventDialog,
  toggleCategoryFilter,
  setSelectedDate,
  setCurrentDate,
} from "../../redux/eventSlice";
import type { EventCategory } from "../../types/event";
import dayjs from "dayjs";
import gsap from "gsap";
import EventFormDrawer from "../events/EventFormDrawer";

const categoryColorMap: Record<EventCategory, string> = {
  Work: "#1a73e8",
  Personal: "#188038",
  Study: "#9334e6",
  Meeting: "#007b83",
  Birthday: "#d01884",
  Holiday: "#f9ab00",
  Important: "#d93025",
};

const allCategories: EventCategory[] = [
  "Work",
  "Personal",
  "Study",
  "Meeting",
  "Birthday",
  "Holiday",
  "Important",
];

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeCategoryFilters, currentDate, selectedDate } = useSelector(
    (state: RootState) => state.events,
  );

  const [miniDate, setMiniDate] = useState(dayjs(currentDate));

  // Ref for the container that holds the calendar grid to apply GSAP animation
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleCreateClick = () => {
    dispatch(openCreateEventDialog());
  };

  const handleCategoryToggle = (category: EventCategory) => {
    dispatch(toggleCategoryFilter(category));
  };

  const animateSlide = (direction: "left" | "right") => {
    if (!calendarRef.current) return;

    // When clicking the right arrow, the new month comes from the right (positive x offset)
    // When clicking the left arrow, the new month comes from the left (negative x offset)
    const xOffset = direction === "right" ? 40 : -40;

    gsap.fromTo(
      calendarRef.current,
      { x: xOffset, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "transform", // Cleans up transform styles after animation completes
      },
    );
  };

  const handleMiniPrevMonth = () => {
    setMiniDate((prev) => {
      const newDate = prev.subtract(1, "month");
      return newDate;
    });
    animateSlide("left");
  };

  const handleMiniNextMonth = () => {
    setMiniDate((prev) => {
      const newDate = prev.add(1, "month");
      return newDate;
    });
    animateSlide("right");
  };

  const handleMiniDateClick = (dayString: string) => {
    dispatch(setSelectedDate(dayString));
    dispatch(setCurrentDate(dayString));
  };

  const startOfMonth = miniDate.startOf("month");
  const startDayOfWeek = startOfMonth.day();
  const startDate = startOfMonth.subtract(startDayOfWeek, "day");

  const miniDays = Array.from({ length: 42 }).map((_, index) => {
    return startDate.add(index, "day");
  });

  return (
    <Box
      sx={{
        width: "var(--sidebar-width)",
        flexShrink: 0,
        height: "100%",
        backgroundColor: "var(--bg-primary)",
        borderRight: "1px solid var(--border-primary)",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflowY: "auto",
      }}
    >
      <Button
        onClick={handleCreateClick}
        variant="outlined"
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
        Create Event
      </Button>

      {/* <EventFormDrawer/> */}

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-secondary)",
          overflow: "hidden", // Ensures sliding content stays neatly inside the paper box
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
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "var(--text-primary)" }}
          >
            {miniDate.format("MMMM YYYY")}
          </Typography>
          <Box>
            <IconButton size="small" onClick={handleMiniPrevMonth}>
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleMiniNextMonth}>
              <ChevronRight fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Animated Wrapper Container */}
        <Box ref={calendarRef}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              mb: 0.5,
            }}
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <Typography
                key={i}
                variant="caption"
                sx={{ color: "var(--text-tertiary)", fontWeight: 600 }}
              >
                {d}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              textAlign: "center",
            }}
          >
            {miniDays.map((day, idx) => {
              const isCurrentMonth = day.month() === miniDate.month();
              const isSelected = day.isSame(dayjs(selectedDate), "day");
              const isToday = day.isSame(dayjs(), "day");

              return (
                <Box
                  key={idx}
                  onClick={() => handleMiniDateClick(day.format("YYYY-MM-DD"))}
                  sx={{
                    py: 0.5,
                    fontSize: "10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    color: !isCurrentMonth
                      ? "var(--text-disabled)"
                      : isToday
                        ? "var(--text-on-primary)"
                        : "var(--text-primary)",
                    backgroundColor: isToday
                      ? "var(--google-blue)"
                      : isSelected
                        ? "var(--google-blue-light)"
                        : "transparent",
                    fontWeight: isToday || isSelected ? 1000 : 500,
                    "&:hover": {
                      backgroundColor: isToday
                        ? "var(--google-blue-dark)"
                        : "var(--bg-hover)",
                    },
                  }}
                >
                  {day.date()}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "var(--text-primary)", mb: 1 }}
        >
          My Calendars / Categories
        </Typography>
        <FormGroup sx={{ gap: 0.5 }}>
          {allCategories.map((cat) => {
            const isChecked = activeCategoryFilters.includes(cat);
            const color = categoryColorMap[cat];

            return (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat)}
                    size="small"
                    sx={{
                      color,
                      "&.Mui-checked": {
                        color,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: color,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "13px", color: "var(--text-primary)" }}
                    >
                      {cat}
                    </Typography>
                  </Box>
                }
              />
            );
          })}
        </FormGroup>
      </Box>
    </Box>
  );
};
