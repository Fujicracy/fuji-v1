import React from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';

import Header from 'components/Header';
import Profile from './Profile';
import Inventory from './Inventory';
import Store from './Store';

function NftGame() {
  const { path } = useRouteMatch();

  return (
    <>
      <Header />

      <nav>
        <ul>
          <li>
            <NavLink to={path}>Profile</NavLink>
          </li>
          <li>
            <NavLink to={`${path}/store`}>Store</NavLink>
          </li>
          <li>
            <NavLink to={`${path}/inventory`}>Inventory</NavLink>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path={path}>
          <Profile />
        </Route>
        <Route path={`${path}/store`}>
          <Store />
        </Route>
        <Route path={`${path}/inventory`}>
          <Inventory />
        </Route>
      </Switch>
    </>
  );
}

export default NftGame;
