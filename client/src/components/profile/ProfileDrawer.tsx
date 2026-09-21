import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Schedule as TimezoneIcon,
  Badge as IDIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { logoutUser } from '../../redux/authSlice';

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          {/* Subtle Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(32, 33, 36, 0.4)',
              backdropFilter: 'blur(3px)',
              zIndex: 1200,
            }}
          />

          {/* Framer Motion Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--bg-primary)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1201,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-google)', fontWeight: 600 }}>
                My Profile
              </Typography>
              <IconButton size="small" onClick={onClose} sx={{ color: 'var(--text-secondary)' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* User Identity Card */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 72, height: 72, fontSize: 28, bgcolor: 'var(--google-blue)', boxShadow: 'var(--shadow-sm)' }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="h6" noWrap sx={{ fontFamily: 'var(--font-google)', fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="var(--text-secondary)" noWrap>
                    {user.email}
                  </Typography>
                  <Chip
                    icon={<SecurityIcon style={{ fontSize: 14 }} />}
                    label="Google Verified Account"
                    color="success"
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, fontWeight: 500, fontSize: '11px' }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Account Details */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                Account Details
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <EmailIcon color="action" />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{user.email}</Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <IDIcon color="action" />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="caption" color="text.secondary">User Account ID</Typography>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '12px' }}>
                      {user._id || user.id}
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <TimezoneIcon color="action" />
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="caption" color="text.secondary">Timezone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.timezone || 'Asia/Kolkata'}</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Footer Action */}
            <Box sx={{ p: 2.5, borderTop: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 'var(--radius-full)',
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
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
