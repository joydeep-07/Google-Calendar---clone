import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import {
  CalendarMonth as CalendarIcon,
  FlashOn as DevIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { devLoginUser } from '../redux/authSlice';

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [devLoading, setDevLoading] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const oauthError = searchParams.get('error');

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${apiBase}/auth/google`;
  };

  const handleDevLogin = async () => {
    setDevLoading(true);
    await dispatch(devLoginUser({ email: 'demo.user@calendar.local', name: 'Demo User' }));
    setDevLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary)",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          p: { xs: 2, sm: 4 },
          backgroundColor: "var(--bg-primary)",
          textAlign: "center",
        }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 3, p: 0 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarIcon sx={{ fontSize: 56, color: "var(--google-blue)" }} />
            <Typography
              variant="h5"
              color="var(--text-primary)"
              sx={{ fontFamily: "var(--font-google)", fontWeight: 600 }}
            >
              Google Calendar Clone
            </Typography>
            <Typography variant="body2" color="var(--text-secondary)">
              Sign in to manage your events, tasks, and schedules seamlessly
            </Typography>
          </Box>

          {oauthError && (
            <Alert severity="warning" sx={{ textAlign: "left" }}>
              Google OAuth step was canceled or not yet configured. You can use
              the instant Demo Login button below to test all functionality!
            </Alert>
          )}

          {error && !oauthError && (
            <Alert severity="error" sx={{ textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <Button
            variant="outlined"
            size="large"
            onClick={handleGoogleLogin}
            startIcon={<FcGoogle />}
            sx={{
              py: 1.5,
              borderRadius: "var(--radius-full)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-google)",
              fontWeight: 500,
              fontSize: "15px",
              textTransform: "none",
              boxShadow: "var(--shadow-sm)",
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
                borderColor: "var(--border-focus)",
                boxShadow: "var(--shadow-md)",
              },
            }}
          >
            Continue with Google
          </Button>

          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="var(--text-tertiary)">
              OR QUICK TEST LOGIN
            </Typography>
          </Divider>

          <Button
            variant="contained"
            size="large"
            onClick={handleDevLogin}
            disabled={devLoading || isLoading}
            startIcon={
              devLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DevIcon />
              )
            }
            sx={{
              py: 1.5,
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--button-primary)",
              color: "var(--text-on-primary)",
              fontFamily: "var(--font-google)",
              fontWeight: 500,
              fontSize: "15px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--button-primary-hover)",
              },
            }}
          >
            {devLoading ? "Logging in..." : "Instant Demo / Test Login"}
          </Button>

          <Typography
            variant="caption"
            color="var(--text-tertiary)"
            sx={{ mt: 2 }}
          >
            Powered by Node.js, Express, MongoDB, Socket.IO, MUI, and Redux
            Toolkit
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
