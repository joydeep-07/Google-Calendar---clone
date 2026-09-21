import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Logout as LogoutIcon,
  Email as EmailIcon,
  Schedule as TimezoneIcon,
  Badge as IDIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        p: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/calendar')}
          sx={{ mb: 2, color: 'var(--text-secondary)' }}
        >
          Back to Calendar
        </Button>

        <Card
          sx={{
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            backgroundColor: 'var(--bg-primary)',
            p: 3,
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 80, height: 80, fontSize: 32, bgcolor: 'var(--google-blue)' }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="var(--text-secondary)">
                  {user.email}
                </Typography>
                <Chip
                  label="Authenticated User"
                  color="success"
                  size="small"
                  sx={{ mt: 1, fontWeight: 500 }}
                />
              </Box>
            </Box>

            <Divider />

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Account Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email Address</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.email}</Typography>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <IDIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">User Account ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{user._id || user.id}</Typography>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <TimezoneIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Timezone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.timezone || 'Asia/Kolkata'}</Typography>
                </Box>
              </Paper>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
