import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { ProvideAuth } from "./hooks";

import Home from "./Home";
import Dashboard from "./Dashboard/Dashboard";
import Infos from "./Infos";
import Team from "./Team";
import Error from "./Error";

function App(props) {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/dashboard">
          <ProvideAuth>
            <Dashboard />
          </ProvideAuth>
        </Route>
        <Route path="/team">
          <Team />
        </Route>
        <Route path="/about">
          <Infos />
        </Route>
        <Route path={"*"}>
          <Error />
        </Route>
      </Switch>
      <div className="bg-effect"></div>
      <div className="ohno">Oh no!<br />This website isn't available (yet) on mobile</div>
    </BrowserRouter>
  );
}

export default App;
