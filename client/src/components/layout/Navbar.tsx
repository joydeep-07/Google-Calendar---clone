import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  CalendarMonth as CalendarLogoIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { setSearchQuery } from "../../redux/eventSlice";
import dayjs from "dayjs";

interface NavbarProps {
  onToggleSidebar: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenProfile,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentDate, searchQuery } = useSelector(
    (state: RootState) => state.events,
  );

  const handleAvatarClick = () => {
    if (onOpenProfile) {
      onOpenProfile();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const formattedMonthYear = dayjs(currentDate).format("MMMM YYYY");

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-primary)",
        height: "var(--navbar-height)",
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 }, justifyContent: "space-between" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <IconButton
            onClick={onToggleSidebar}
            edge="start"
            aria-label="menu"
            sx={{ color: "var(--text-secondary)" }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <CalendarLogoIcon
              sx={{ color: "var(--google-blue)", fontSize: 30 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: "var(--font-google)",
                fontWeight: 500,
                color: "var(--text-primary)",
                display: { xs: "none", sm: "block" },
              }}
            >
              Calendar
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={onToday}
            sx={{
              ml: { xs: 0.5, sm: 2 },
              borderRadius: "var(--radius-sm)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              px: { xs: 1.5, sm: 2 },
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
                borderColor: "var(--border-primary)",
              },
            }}
          >
            Today
          </Button>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Previous month">
              <IconButton
                onClick={onPrevMonth}
                size="small"
                sx={{ color: "var(--text-secondary)" }}
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>

            <Tooltip title="Next month">
              <IconButton
                onClick={onNextMonth}
                size="small"
                sx={{ color: "var(--text-secondary)" }}
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-google)",
              fontWeight: 500,
              fontSize: { xs: "16px", sm: "20px" },
              color: "var(--text-primary)",
              minWidth: { sm: 160 },
            }}
          >
            {formattedMonthYear}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              px: 2,
              py: 0.5,
              width: 260,
              transition: "var(--transition-normal)",
              "&:focus-within": {
                backgroundColor: "var(--bg-primary)",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--google-blue)",
              },
            }}
          >
            <SearchIcon
              sx={{ color: "var(--text-secondary)", mr: 1, fontSize: 20 }}
            />
            <InputBase
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--text-primary)",
                width: "100%",
              }}
            />
          </Box>

          {user && (
            <Box>
              <Tooltip title={user.name || user.email}>
                <IconButton onClick={handleAvatarClick} sx={{ p: 0.5 }}>
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "var(--google-blue)",
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
