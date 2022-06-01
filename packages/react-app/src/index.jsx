import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import App from 'containers/App/index';
import './index.css';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  environment: process.env.NODE_ENV,

  dsn: 'https://def3a0781a2940928ac17e8f25b03dea@o1151449.ingest.sentry.io/6228136',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
      md: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
      lg: BREAKPOINTS[BREAKPOINT_NAMES.DESKTOP].inNumber,
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  palette: {
    primary: {
      main: 'rgba(240, 1, 79, 1)', // --brand
    },
    secondary: {
      main: '#FF0101',
    },
    success: {
      main: '#20E600',
    },
  },
  overrides: {
    MuiTypography: {
      root: {
        color: 'rgba(255, 255, 255, 1)', // --text
      },
      h3: {
        fontSize: '1rem',
        fontWeight: '500',
      },
      body2: {
        fontSize: '0.75rem',
        fontWeight: '500',
        lineHeight: '150%',
      },
    },
    MuiButton: {
      root: {
        border: 'none',
        borderRadius: '0.5rem',
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        height: '3rem',
        width: '100%',
        transition: 'all 250ms ease',
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        border: 'none',
      },
    },
    MuiInput: {
      input: {
        '&:before': {
          borderColor: 'white',
        },
        '&:hover': {
          borderColor: 'white',
        },
      },
    },
    MuiInputBase: {
      root: {
        color: 'white',
      },
      input: {
        borderBottom: '1px solid white',
        fontSize: 12,
      },
    },
    MuiPickersBasePicker: {
      pickerView: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: 'white',
      },
    },
  },
});

ReactDOM.render(
  <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById('root'),
);
