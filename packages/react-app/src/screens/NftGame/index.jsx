import React from 'react';
// import { Flex } from 'rebass';
import styled from 'styled-components';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';

import { BackgroundEffect } from 'components';
import Header from 'components/Header';
import Profile from './Profile';
import Inventory from './Inventory';
import Store from './Store';

const Flex = styled.ul`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

const StyledNavLink = styled(NavLink)`
  padding: 8px 24px;

  display: block;
  font-size: 14px;
  line-height: 21px;
  color: white;

  &.active {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid #e9024d;
    box-sizing: border-box;
    border-radius: 30px;
  }
`;

function NftGame() {
  const { path } = useRouteMatch();

  return (
    <>
      <Header />

      <Flex>
        <ul>
          <StyledNavLink exact to={path}>
            Profile
          </StyledNavLink>
        </ul>
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
