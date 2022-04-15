import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import { Flex, Box } from 'rebass';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { useCratesBalance, useGearsBalance } from 'hooks';

import { BackgroundEffect, NavBackLink, Header, SectionTitle } from 'components';

import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Profile from './Profile';
import Rules from './Rules';
import Inventory from './Inventory';
import Leaderboard from './Leaderboard';
import Store from './Store';
import { StyledNavLink, NavigationContainer, HeaderBackContainer, HightLightBadge } from './styles';

const ClaimHeader = () => {
  return (
    <Flex
      height="56px"
      padding="16px"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <HeaderBackContainer>
        <NavBackLink to="/dashboard/my-positions" m={0}>
          <ArrowBackIosOutlinedIcon />
        </NavBackLink>
      </HeaderBackContainer>
      <SectionTitle>Climbing Campaign</SectionTitle>
    </Flex>
  );
};
function NftGame() {
  const { path } = useRouteMatch();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const crates = useCratesBalance();
  const gears = useGearsBalance();
  console.count('NFT game');

  return (
    <>
      {isMobile ? <ClaimHeader /> : <Header />}
      <BackgroundEffect />
      <Flex flexDirection="row" justifyContent="center">
        {!isMobile && (
          <Box margin="24px 48px 0px 0px" maxWidth="340px">
            <Rules />
            <br />
            <Profile />
            <br />
          </Box>
        )}
        <Flex flexDirection="column" alignItems="left">
          <NavigationContainer>
            {isMobile && (
              <li>
                <StyledNavLink to={`${path}/profile`}>Profile</StyledNavLink>
              </li>
            )}
            <li>
              <StyledNavLink to={`${path}/store`}>Store</StyledNavLink>
            </li>
            <li>
              <StyledNavLink to={`${path}/inventory`}>
                Inventory
                {(crates.total > 0 || gears.total > 0) &&
                  (isMobile ? (
                    <HightLightBadge />
                  ) : (
                    <span>{` (${crates.total + gears.total})`}</span>
                  ))}
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink to={`${path}/leaderboard`}>Leaderboard</StyledNavLink>
            </li>
            <li>
              <StyledNavLink disabled to={`${path}/lock-points`} onClick={e => e.preventDefault()}>
                <Flex alignItems="center" justifyContent="center">
                  Lock points
                  <LockOutlinedIcon fontSize="small" />
                </Flex>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink disabled to={`${path}/bond-factory`} onClick={e => e.preventDefault()}>
                <Flex alignItems="center" justifyContent="center">
                  Bond factory
                  <LockOutlinedIcon fontSize="small" />
                </Flex>
              </StyledNavLink>
            </li>
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
              <Route path={`${path}/leaderboard`}>
                <Leaderboard />
              </Route>
            </Switch>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default NftGame;
