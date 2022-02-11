import React from 'react';
import styled from 'styled-components';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';

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
