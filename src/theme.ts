import { createTheme, ThemeOptions } from '@mui/material/styles';

// Courtcase color palette
const colors = {
  primary: {
    main: '#FF9F1C',
    light: '#FFBF69',
    dark: '#F27D0C',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2EC4B6',
    light: '#CBF3F0',
    dark: '#1B9E8F',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#FF3B30',
    light: '#FF6B61',
    dark: '#CC2F26',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF9500',
    light: '#FFAC33',
    dark: '#CC7700',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#007AFF',
    light: '#3395FF',
    dark: '#0062CC',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#34C759',
    light: '#5DD27A',
    dark: '#299F47',
    contrastText: '#FFFFFF',
  },
  grey: {
    50: '#F9F9F9',
    100: '#F2F2F2',
    200: '#E6E6E6',
    300: '#CCCCCC',
    400: '#B3B3B3',
    500: '#999999',
    600: '#666666',
    700: '#4D4D4D',
    800: '#333333',
    900: '#1A1A1A',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F9F9F9',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
};

// Theme configuration
const themeOptions: ThemeOptions = {
  palette: colors,
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

// Create a theme instance
const theme = createTheme(themeOptions);

export default theme;
