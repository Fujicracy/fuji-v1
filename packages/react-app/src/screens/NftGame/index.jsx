import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import { Flex } from 'rebass';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { BackgroundEffect } from 'components';
import Header from 'components/Header';
import Profile from './Profile';
import Inventory from './Inventory';
import Store from './Store';
import { StyledNavLink, NavigationContainer } from './styles';

function NftGame() {
  const { path } = useRouteMatch();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <>
      <Header />
      <BackgroundEffect />
      <Flex flexDirection="row" justifyContent="center">
        {!isMobile && (
          <Flex margin="24px 48px 0px 0px">
            <Profile />
          </Flex>
        )}
        <Flex flexDirection="column" alignItems="left">
          <NavigationContainer>
            {isMobile && (
              <ul>
                <StyledNavLink to={`${path}/profile`}>Profile</StyledNavLink>
              </ul>
            )}
            <ul>
              <StyledNavLink to={`${path}/store`}>Store</StyledNavLink>
            </ul>
            <ul>
              <StyledNavLink to={`${path}/inventory`}>Inventory</StyledNavLink>
            </ul>
          </NavigationContainer>

          <Flex justifyContent="center">
            <Switch>
              <Route exact path={path}>
                {isMobile ? <Redirect to={`${path}/profile`} /> : <Redirect to={`${path}/store`} />}
              </Route>
              <Route path={`${path}/profile`}>
                {!isMobile ? <Redirect to={`${path}/store`} /> : <Profile />}
              </Route>
              <Route path={`${path}/store`}>
                <Store />
              </Route>
              <Route path={`${path}/inventory`}>
                <Inventory />
              </Route>
            </Switch>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default NftGame;
