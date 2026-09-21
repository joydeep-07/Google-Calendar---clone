import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  CalendarMonth as CalendarLogoIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { logoutUser } from "../../redux/authSlice";
import { setSearchQuery } from "../../redux/eventSlice";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface NavbarProps {
  onToggleSidebar: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentDate, searchQuery } = useSelector(
    (state: RootState) => state.events,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleNavigateProfile = () => {
    handleCloseUserMenu();
    navigate("/profile");
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
            onClick={() => navigate("/calendar")}
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
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
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

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: {
                      borderRadius: "var(--radius-lg)",
                      minWidth: 220,
                      mt: 1,
                      p: 1,
                    },
                  },
                }}
              >
                <div className="min-w-[280px]">
                  <Box>
                    {/* User Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: "14px",
                      }}
                    >
                      <Avatar
                        alt={user.name}
                        src={user.avatar}
                        sx={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          bgcolor: "var(--google-blue)",
                          color: "#fff",
                          fontSize: "17px",
                          fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                        }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-main)",
                            lineHeight: 1.4,
                          }}
                        >
                          {user.name}
                        </Typography>

                        <Typography
                          noWrap
                          sx={{
                            mt: 0.25,
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.4,
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* <Divider
                    sx={{
                      borderColor: "var(--border-light)",
                    }}
                  /> */}

                  {/* Menu Items */}
                  <Box sx={{ px: 1, py: 1 }}>
                    <MenuItem
                      onClick={handleNavigateProfile}
                      sx={{
                        minHeight: 42,
                        borderRadius: "10px",
                        px: 1.5,
                        gap: 1.5,
                        color: "var(--text-main)",
                        transition: "background-color 0.2s ease",

                        "&:hover": {
                          backgroundColor: "var(--bg-secondary)",
                        },
                      }}
                    >
                      <ProfileIcon
                        sx={{
                          fontSize: 20,
                          color: "var(--text-secondary)",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        My Profile
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        minHeight: 42,
                        borderRadius: "10px",
                        px: 1.5,
                        gap: 1.5,
                        color: "var(--google-red)",
                        transition: "background-color 0.2s ease",

                        "&:hover": {
                          backgroundColor: "rgba(234, 67, 53, 0.08)",
                        },
                      }}
                    >
                      <LogoutIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Logout
                      </Typography>
                    </MenuItem>
                  </Box>
                </div>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
