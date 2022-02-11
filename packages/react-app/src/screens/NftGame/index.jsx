import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { BackgroundEffect } from 'components';
import Header from 'components/Header';
import Profile from './Profile';
import Inventory from './Inventory';
import Store from './Store';
import { StyledNavLink, Flex } from './styles';

function NftGame() {
  const { path } = useRouteMatch();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  useEffect(() => {
    if (!isMobile) {
      console.log('redirecting');
      <Redirect
        to={{
          pathname: `${path}/store`,
        }}
      />;
    }
  }, [isMobile, path]);

  return (
    <>
      <Header />

      <Flex>
        {isMobile && (
          <ul>
            <StyledNavLink exact to={path}>
              Profile
            </StyledNavLink>
          </ul>
        )}
        <ul>
          <StyledNavLink to={`${path}/store`}>Store</StyledNavLink>
        </ul>
        <ul>
          <StyledNavLink to={`${path}/inventory`}>Inventory</StyledNavLink>
        </ul>
      </Flex>

      <Flex>
        <Switch>
          <BackRoute exact path={path}>
            {isMobile ? <Redirect to={`${path}/profile`} /> : <Redirect to={`${path}/store`} />}
          </BackRoute>
          <BackRoute path={`${path}/profile`}>
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
