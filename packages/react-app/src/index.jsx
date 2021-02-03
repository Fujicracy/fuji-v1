import React from "react";
import ReactDOM from "react-dom";
//import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./index.css";
import FujiApp from "./FujiApp";

//let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"

//const client = new ApolloClient({
  //uri: subgraphUri,
  //cache: new InMemoryCache()
//});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#0009E9"
    },
    secondary: {
      main: "#FF0101"
    },
    success: {
      main: "#20E600"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        color: "#FF0101",
        border: "5px solid #0009E9",
        borderRadius: 50,
        boxSizing: "border-box",
        boxShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
        textTransform: "none",
        margin: "5px",
      }
    },
    MuiFormControl: {
      root: {
        border: "5px solid #0009E9",
        borderRadius: 50,
        boxSizing: "border-box",
        boxShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
      }
    },
    MuiOutlinedInput: {
      root: {
        fontSize: '1.3em'
      },
      notchedOutline: {
        border: 'none'
      }
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <FujiApp/>
  </ThemeProvider>,
  document.getElementById("root"),
);
