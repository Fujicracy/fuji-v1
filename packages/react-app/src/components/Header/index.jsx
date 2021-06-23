import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from 'hooks';
import { Container, Logo, Navigation } from './styles';
import { LANDING_URL } from '../../constants/providers';

function Header() {
  const [logout, setLogout] = useState(false);
  const { address, loadWeb3Modal, logoutOfWeb3Modal } = useAuth();

  return (
    <Container>
      <Link to={LANDING_URL} className="logo">
        <Logo alt="logo" src="/logo-title.svg" />
      </Link>

      {address && (
        <Navigation>
          <li className="nav-item">
            <NavLink to="/dashboard/init-borrow" activeClassName="current">
              Borrow
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/dashboard/my-positions" activeClassName="current">
              My positions
            </NavLink>
          </li>

          <li>
            <a
              href="/"
              onClick={() => (!address ? loadWeb3Modal() : logoutOfWeb3Modal())}
              onMouseEnter={() => setLogout(true)}
              onMouseLeave={() => setLogout(false)}
              className={address ? 'button-nav connected' : 'button-nav'}
            >
              {!address
                ? 'Connect Wallet'
                : logout
                ? 'Disconnect'
                : address.substr(0, 6) + '...' + address.substr(-4, 4)}
            </a>
          </li>
        </Navigation>
      )}
    </Container>
  );
}

export default Header;
