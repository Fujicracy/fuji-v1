import React from 'react';
import { Flex } from 'rebass';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';

import { BackgroundEffect } from 'components';
import Header from 'components/Header';
import Profile from './Profile';
import Inventory from './Inventory';
import Store from './Store';

function NftGame() {
  const { path } = useRouteMatch();

  return (
    <>
      <Header />

      <Flex flexDirection="row" alignItems="center" justifyContent="center" mt="32px">
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
          <BackRoute exact path={path}>
            <Profile />
          </BackRoute>
          <BackRoute path={`${path}/store`}>
            <Store />
          </BackRoute>
          <BackRoute path={`${path}/inventory`}>
            <Inventory />
          </BackRoute>
        </Switch>
      </Flex>
    </>
  );
}

function BackRoute({ children, ...rest }) {
  return (
    <>
      <Route {...rest} render={() => children} />
      <BackgroundEffect />
    </>
  );
}

export default NftGame;
