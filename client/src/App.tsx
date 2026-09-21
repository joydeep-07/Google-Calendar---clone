import { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './redux/store';
import { checkAuthStatus } from './redux/authSlice';
import { Login } from './pages/Login';
import { CalendarPage } from './pages/Calendar';
import { LoadingScreen } from './components/common/LoadingScreen';

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Parse OAuth callback token parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      localStorage.setItem('token', tokenParam);
      // Clean query parameter from address bar keeping URL cleanly at '/'
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoading ? (
        <LoadingScreen message="Checking authentication..." />
      ) : isAuthenticated ? (
        <CalendarPage />
      ) : (
        <Login />
      )}
    </ThemeProvider>
  );
}

export default App;
