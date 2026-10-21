import { createTheme } from '@mui/material/styles';

export const propertyTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D9488', // Emerald Teal
      dark: '#0F766E',
      light: '#2DD4BF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1E293B', // Rich Slate
      dark: '#0F172A',
      light: '#334155',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Plus Jakarta Sans", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 14px 28px -12px rgba(15, 23, 42, 0.12)',
          },
        },
      },
    },
  },
});
