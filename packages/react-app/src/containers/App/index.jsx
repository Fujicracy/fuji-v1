import React from 'react';
import { HashRouter, Switch, Route, NavLink } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ModalProvider } from 'styled-react-modal';
import { ProvideAuth } from 'hooks';
import GlobalStyle from 'components/GlobalStyle';
import themes from 'theme';
import map from 'lodash/map';

import Home from 'screens/Home';
import Dashboard from 'screens/Dashboard';
import Infos from 'screens/Infos';
import About from 'screens/About';
import Team from 'screens/Team';
import Error from 'screens/Error';
import { NavUnlisted, NavImageLink, NavTextLink, Label } from 'components/UI';
import { CONTACTS } from 'consts/contacts';

import { Container, FadingBackground, NavText } from './styles';
import './style.css';

function App() {
  const theme = themes.main;

  return (
    <ThemeProvider theme={theme}>
      <ModalProvider backgroundComponent={FadingBackground}>
        <Container>
          <GlobalStyle />
          <HashRouter>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/dashboard">
                <ProvideAuth>
                  <Dashboard />
                </ProvideAuth>
              </Route>
              <Route path="/team">
                <Team />
              </Route>
              <Route path="/about">
                <ProvideAuth>
                  <About />
                </ProvideAuth>
              </Route>
              <Route path="/info">
                <Infos />
              </Route>
              <Route path="*">
                <Error />
              </Route>
            </Switch>
            <footer>
              <NavUnlisted justifyContent="space-between" position="left">
                {map(Object.keys(CONTACTS), key => (
                  <NavImageLink key={key} contact={CONTACTS[key]} />
                ))}
              </NavUnlisted>

              <NavUnlisted justifyContent="flex-start" position="right">
                <NavLink to="/about">
                  <NavText>About</NavText>
                </NavLink>
                <NavTextLink url="https://docs.fujidao.org">Documentation</NavTextLink>
                <Label fontSize={12}>© FujiDAO 2021</Label>
              </NavUnlisted>
            </footer>
            <div className="bg-effect" />
            <div className="ohno">
              Oh no!
              <br />
              This website isn&apos;t available (yet) on mobile
            </div>
          </HashRouter>
        </Container>
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;
