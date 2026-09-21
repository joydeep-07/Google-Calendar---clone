import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8', // Matches --google-blue-dark & --button-primary
      light: '#e8f0fe',
      dark: '#1765cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5f6368', // Matches --text-secondary
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff', // Matches --bg-primary
      paper: '#ffffff',
    },
    text: {
      primary: '#202124', // Matches --text-primary
      secondary: '#5f6368', // Matches --text-secondary
      disabled: '#9aa0a6',
    },
    divider: '#dadce0', // Matches --border-primary
    error: {
      main: '#ea4335', // Matches --google-red
    },
    success: {
      main: '#34a853', // Matches --google-green
    },
    warning: {
      main: '#fbbc04', // Matches --google-yellow
    },
  },
  typography: {
    fontFamily: '"Google Sans Text", "Google Sans", Arial, sans-serif',
    button: {
      fontFamily: '"Google Sans", "Google Sans Text", Arial, sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Google Sans", Arial, sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Google Sans", Arial, sans-serif',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px rgba(60,64,67,0.3)',
          },
        },
        contained: {
          backgroundColor: '#1a73e8',
          '&:hover': {
            backgroundColor: '#1765cc',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(60,64,67,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});
