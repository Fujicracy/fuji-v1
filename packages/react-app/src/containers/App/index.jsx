import React from 'react';
import { HashRouter, Switch, Route, NavLink, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { ProvideAuth } from 'hooks';
import GlobalStyle from 'components/GlobalStyle';
import themes from 'theme';
import map from 'lodash/map';
import { useMediaQuery } from 'react-responsive';
import { Box, Flex } from 'rebass';

import Home from 'screens/Home';
import Dashboard from 'screens/Dashboard';
import About from 'screens/About';
import Error from 'screens/Error';
import Governance from 'screens/Governance';
import NftGame from 'screens/NftGame';

import { NavImageLink, NavTextLink, Label } from 'components/UI';
import { CONTACTS } from 'consts/contacts';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Container, FadingBackground, NavText } from './styles';

function App() {
  const theme = themes.main;

  const isMobileOrTablet = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <ThemeProvider theme={theme}>
      <ModalProvider backgroundComponent={FadingBackground}>
        <HashRouter>
          <Container>
            <GlobalStyle />
            <Switch>
              <Route exact path="/" component={Home} />
              <ProvideAuth>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/about" component={About} />
                <Route path="/claim-nft" component={Governance} />
                <Route path="/nft-game" component={NftGame} />
              </ProvideAuth>
              <Route path="*" component={Error} />
            </Switch>
          </Container>
          {!isMobileOrTablet && <Footer />}
        </HashRouter>
      </ModalProvider>
    </ThemeProvider>
  );
}

function Footer() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <footer
      style={
        isHome
          ? {
              position: 'fixed',
              bottom: '0px',
              width: '100%',
            }
          : {
              bottom: '57px',
            }
      }
    >
      <Flex justifyContent="space-between" p="3">
        <Box border="1px solid red">
          {map(Object.keys(CONTACTS), key => (
            <NavImageLink key={key} contact={CONTACTS[key]} />
          ))}
        </Box>

        <Flex alignItems="center">
          <NavLink to="/about">
            <NavText>About</NavText>
          </NavLink>
          <NavTextLink url="https://docs.fujidao.org">Documentation</NavTextLink>
          <Label fontSize={12}>© FujiDAO {new Date().getFullYear()}</Label>
        </Flex>
      </Flex>
    </footer>
  );
}

export default App;
