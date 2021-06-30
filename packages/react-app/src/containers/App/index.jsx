import React from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
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
import { NavUnlisted, NavImageLink, NavTextLink } from 'components/UI';
import { CONTACTS } from 'constants/contacts';

import { Container } from './styles';
import './style.css';

function App() {
  const theme = themes.main;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GlobalStyle />
        <BrowserRouter>
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

            <nav className="footer-links">
              <ul>
                <li>
                  <NavLink to="/about">About</NavLink>
                </li>
                <li>
                  <a href="https://docs.fujidao.org" target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </li>
                <li>© FujiDAO 2021</li>
              </ul>
            </nav>
            <NavUnlisted justifyContent="flex-start" position="right">
              <NavTextLink url="https://docs.fujidao.org">About</NavTextLink>
            </NavUnlisted>
          </footer>
          <div className="bg-effect" />
          <div className="ohno">
            Oh no!
            <br />
            This website isn&apos;t available (yet) on mobile
          </div>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
