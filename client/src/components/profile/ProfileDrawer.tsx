import React, { useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Schedule as TimezoneIcon,
  Badge as IDIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { logoutUser } from "../../redux/authSlice";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleLogout = () => {
    onClose();
    dispatch(logoutUser());
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Light Backdrop with Soft Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.2)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1200,
            }}
          />

          {/* Premium Light Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: easeInOut, duration: 0.35 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "480px",
              backgroundColor: "#ffffff",
              borderLeft: "1px solid rgba(0, 0, 0, 0.06)",
              boxShadow: "-20px 0 50px rgba(0, 0, 0, 0.08)",
              zIndex: 1201,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top Bar Header with Close Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3.5,
                py: 2.5,
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-google)",
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "1rem",
                }}
              >
                Profile Overview
              </Typography>
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#000",
                    backgroundColor: "rgba(0, 0, 0, 0.06)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 3.5,
                display: "flex",
                flexDirection: "column",
                gap: 3.5,
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "3px",
                },
              }}
            >
              {/* User Identity Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 2.5,
                  borderRadius: "10px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "50%",
                    padding: "3px",
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{
                      width: 76,
                      height: 76,
                      fontSize: 26,
                      fontWeight: 600,
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </Box>

                <Box sx={{ overflow: "hidden", flex: 1 }}>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      fontFamily: "var(--font-google)",
                      fontWeight: 600,
                      color: "#0f172a",
                      fontSize: "1.1rem",
                      mb: 0.2,
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(15, 23, 42, 0.6)", fontSize: "0.85rem" }}
                    noWrap
                  >
                    {user.email}
                  </Typography>
                  <Chip
                    icon={
                      <VerifiedIcon
                        sx={{
                          fontSize: "13px !important",
                          color: "#2563eb !important",
                        }}
                      />
                    }
                    label="Verified Account"
                    size="small"
                    sx={{
                      mt: 1.2,
                      height: "22px",
                      fontWeight: 500,
                      fontSize: "10px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: "#2563eb",
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.2)",
                      "& .MuiChip-icon": {
                        marginLeft: "6px",
                      },
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.06)" }} />

              {/* Account Details Section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "rgba(15, 23, 42, 0.7)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.5px",
                    mb: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Account Details
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {/* Email Detail Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                       borderRadius: "100px",
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                      }}
                    >
                      <EmailIcon fontSize="small" />
                    </Box>
                    <Box sx={{ overflow: "hidden", flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(15, 23, 42, 0.5)",
                          fontSize: "11px",
                          display: "block",
                        }}
                      >
                        Email Address
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: 500,
                          color: "#0f172a",
                          fontSize: "0.9rem",
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* ID Detail Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                       borderRadius: "100px",
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                      }}
                    >
                      <IDIcon fontSize="small" />
                    </Box>
                    <Box sx={{ overflow: "hidden", flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(15, 23, 42, 0.5)",
                          fontSize: "11px",
                          display: "block",
                        }}
                      >
                        User Account ID
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: 500,
                          fontFamily: "monospace",
                          fontSize: "12px",
                          color: "#0f172a",
                        }}
                      >
                        {user._id || user.id}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Timezone Detail Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                       borderRadius: "100px",
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(0, 0, 0, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#475569",
                      }}
                    >
                      <TimezoneIcon fontSize="small" />
                    </Box>
                    <Box sx={{ overflow: "hidden", flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(15, 23, 42, 0.5)",
                          fontSize: "11px",
                          display: "block",
                        }}
                      >
                        Timezone
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#0f172a",
                          fontSize: "0.9rem",
                        }}
                      >
                        {user.timezone || "Asia/Kolkata"}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Footer Action */}
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                backgroundColor: "#fafafa",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "10px",
                  py: 1.4,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  letterSpacing: "0.2px",
                  color: "#dc2626",
                  backgroundColor: "rgba(220, 38, 38, 0.06)",
                  border: "1px solid rgba(220, 38, 38, 0.15)",
                  boxShadow: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(220, 38, 38, 0.12)",
                    borderColor: "rgba(220, 38, 38, 0.3)",
                    boxShadow: "0 4px 16px rgba(220, 38, 38, 0.12)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
