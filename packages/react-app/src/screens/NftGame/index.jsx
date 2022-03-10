import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';
import { Flex } from 'rebass';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { useCratesInfo } from 'hooks';

import { BackgroundEffect, NavBackLink, Header, SectionTitle } from 'components';

import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import Profile from './Profile';
import Inventory from './Inventory';
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
        <NavBackLink m={0}>
          <ArrowBackIosOutlinedIcon />
        </NavBackLink>
      </HeaderBackContainer>
      <SectionTitle>Claim NFT</SectionTitle>
    </Flex>
  );
};
function NftGame() {
  const { path } = useRouteMatch();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const { amounts } = useCratesInfo();

  return (
    <>
      {isMobile ? <ClaimHeader /> : <Header />}
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
                {amounts.total > 0 &&
                  (isMobile ? <HightLightBadge /> : <span>{` (${amounts.total})`}</span>)}
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink to={`${path}/lock-points`}>Lock points</StyledNavLink>
            </li>
            <li>
              <StyledNavLink to={`${path}/bond-factory`}>Bond factory</StyledNavLink>
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
            </Switch>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default NftGame;
