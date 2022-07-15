import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Flex, Box } from 'rebass';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { useCratesBalance, useGearsBalance, useSouvenirNFT } from 'hooks';

import { BackgroundEffect, NavBackLink, Header, SectionTitle } from 'components';

import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Profile from './Profile';
import Rules from './Rules';
import Inventory from './Inventory';
import Leaderboard from './Leaderboard';
import Store from './Store';
import LockingCeremony from './LockingCeremony';
import BondFactory from './BondFactory';

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
  const { isLoading, NFTImage } = useSouvenirNFT();
  const bondingAvailable = !isLoading && NFTImage;

  useEffect(() => {
    // stupid trick but putting this in a context make the whole app crash.
    // TODO: rewrite all the polling and hooks logic stuff...
    window?.widgetbotCrate?.show();
    return () => window?.widgetbotCrate?.hide();
  });

  return (
    <>
      {isMobile ? <ClaimHeader /> : <Header />}
      <BackgroundEffect />
      <Flex flexDirection="row" justifyContent="center">
        {!isMobile && (
          <Box margin="0 48px 0px 0px" maxWidth="340px">
            <Rules />
            <br />
            <Profile />
          </Box>
        )}
        <Flex flexDirection="column" alignItems="left">
          <NavigationContainer>
            {isMobile && (
              <>
                <li>
                  <StyledNavLink to={`${path}/profile`}>Profile</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to={`${path}/rules`}>Rules</StyledNavLink>
                </li>
              </>
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
              <StyledNavLink to={`${path}/locking-ceremony`}>
                <Flex alignItems="center" justifyContent="center">
                  Locking ceremony
                </Flex>
              </StyledNavLink>
            </li>
            <li>
              <Tooltip title="Bond Factory will be available only after locking in your points.">
                <StyledNavLink
                  to={`${path}/bond-factory`}
                  disabled={!bondingAvailable}
                  onClick={e => !bondingAvailable && e.preventDefault()}
                >
                  <Flex alignItems="center" justifyContent="center">
                    Bond factory
                    {!bondingAvailable && <LockOutlinedIcon fontSize="small" />}
                  </Flex>
                </StyledNavLink>
              </Tooltip>
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
              <Route path={`${path}/rules`}>
                {!isMobile ? <Redirect to={`${path}/store`} /> : <Rules open margin="0 24px" />}
              </Route>
              <Route path={`${path}/store`} component={Store} />
              <Route path={`${path}/inventory`} component={Inventory} />
              <Route path={`${path}/leaderboard`} component={Leaderboard} />
              <Route path={`${path}/locking-ceremony`} component={LockingCeremony} />
              {bondingAvailable && <Route path={`${path}/bond-factory`} component={BondFactory} />}

              {/* Fallback */}
              <Route path="*">
                {!isMobile ? (
                  <Redirect to={`${path}/store`} />
                ) : (
                  <Redirect to={`${path}/profile`} />
                )}
              </Route>
            </Switch>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default NftGame;
