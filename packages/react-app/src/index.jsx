import React from 'react';
import ReactDOM from 'react-dom';
// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import App from 'containers/App/index';
import './index.css';

// let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"

// const client = new ApolloClient({
// uri: subgraphUri,
// cache: new InMemoryCache()
// });

const theme = createTheme({
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
