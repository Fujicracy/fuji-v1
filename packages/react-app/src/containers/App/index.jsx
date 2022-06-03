import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { ProvideAuth } from 'hooks';
import GlobalStyle from 'components/GlobalStyle';
import themes from 'theme';
import { useMediaQuery } from 'react-responsive';

import Home from 'screens/Home';
import Dashboard from 'screens/Dashboard';
import About from 'screens/About';
import Team from 'screens/Team';
import Error from 'screens/Error';
import Governance from 'screens/Governance';
import NftGame from 'screens/NftGame';

import { Footer } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Container, FadingBackground } from './styles';

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
              <Route path="/team" component={Team} />
              <Route path="/about" component={About} />
              <ProvideAuth>
                <Route path="/dashboard" component={Dashboard} />
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

export default App;
