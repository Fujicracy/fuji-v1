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
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <FujiApp/>
  </ThemeProvider>,
  document.getElementById("root"),
);
