import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import { useContractReader } from "../hooks";
import LinearProgress from '@material-ui/core/LinearProgress';

import MyPositions from "./MyPositions";
import ManagePosition from "./ManagePosition";
import InitBorrow from "./InitBorrow";
import Simulation from "./Simulation";

function Dashboard({ contracts, provider, address, }) {
  const { path } = useRouteMatch();

  const collateralBalance = useContractReader(
    contracts,
    "VaultETHDAI",
    "collaterals",
    [address]
  );

  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={(props) => (
          !collateralBalance
            ? <LinearProgress />
            : collateralBalance.gt(0) 
              ? <Redirect to="/dashboard/my-positions" />
              : <Redirect to="/dashboard/simulation" />
        )}
      />
      <Route exact path={`${path}/simulation`}>
        <Simulation
          contracts={contracts}
          address={address}
        />
      </Route>
      <Route exact path={`${path}/init-borrow`}>
        <InitBorrow
          contracts={contracts}
          provider={provider}
          address={address}
        />
      </Route>
      <Route exact path={`${path}/my-positions`}>
        <MyPositions
          contracts={contracts}
          address={address}
        />
      </Route>
      <Route exact path={`${path}/position`}>
        <ManagePosition
          contracts={contracts}
          provider={provider}
          address={address}
        />
      </Route>
    </Switch>
  );
}

export default Dashboard;
