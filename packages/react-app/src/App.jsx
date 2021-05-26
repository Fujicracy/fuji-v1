import React from 'react';
import { BrowserRouter, Switch, NavLink, Route } from 'react-router-dom';
import './App.css';
import { ProvideAuth } from './hooks';

import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Infos from './screens/Infos';
import About from './screens/About';
import Team from './screens/Team';
import Error from './screens/Error';

function App() {
  return (
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
        <nav className="footer-socials">
          <ul>
            <li>
              <a href="https://twitter.com/FujiFinance" target="_blank" rel="noopener noreferrer">
                <img src="/twitter_1.svg" alt="twitter" />
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/invite/dnvJeEMeDJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/discord_1.svg" alt="discord" />
              </a>
            </li>
            <li>
              <a
                href="https://t.me/joinchat/U4cKWNCUevKVsrtY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/telegram_1.svg" alt="telegram" />
              </a>
            </li>
          </ul>
        </nav>

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
            <li>© Fuji DAO 2021</li>
          </ul>
        </nav>
      </footer>
      <div className="bg-effect" />
      <div className="ohno">
        Oh no!
        <br />
        This website isn&apos;t available (yet) on mobile
      </div>
    </BrowserRouter>
  );
}

export default App;
