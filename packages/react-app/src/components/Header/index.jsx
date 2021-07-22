import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'hooks';
import { Image, Box } from 'rebass';
import { downIcon } from 'assets/images';
import { Label } from 'components/UI';
import { LANDING_URL } from '../../consts/providers';
import {
  Container,
  Logo,
  Navigation,
  BallanceContainer,
  WalletItemContainer,
  WalletHeader,
  WalletItem,
} from './styles';

function Header() {
  const [logout, setLogout] = useState(false);
  const [isOpenWallet, setIsOpenWallet] = useState(false);

  const { address, loadWeb3Modal, onboard, wallet } = useAuth();

  const ellipsedAddress = address ? address.substr(0, 6) + '...' + address.substr(-4, 4) : '';

  console.log({ onboard, wallet, address });
  return (
    <Container>
      <a href={LANDING_URL} className="logo">
        <Logo alt="logo" src="/logo-title.svg" />
      </a>

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
            <BallanceContainer rightPadding={0} onBlur={() => setIsOpenWallet(false)}>
              <Label color="#f5f5f5">123412344.23 ETH</Label>
              <Box
                ml={2}
                sx={{ position: 'relative' }}
                tabIndex="0"
                onBlur={() => setIsOpenWallet(false)}
              >
                <WalletHeader
                  onClick={() => setIsOpenWallet(!isOpenWallet)}
                  isClicked={isOpenWallet}
                >
                  <Label color="#f5f5f5">{ellipsedAddress}</Label>
                  <Image src={downIcon} ml={2} />
                </WalletHeader>
                {isOpenWallet && (
                  <WalletItemContainer>
                    <WalletItem onClick={() => onboard.walletSelect()}>Change Wallet</WalletItem>
                    <WalletItem
                      onClick={() => {
                        setIsOpenWallet(false);
                        onboard.walletReset();
                      }}
                    >
                      Disconnect
                    </WalletItem>
                  </WalletItemContainer>
                )}
              </Box>
            </BallanceContainer>
          </li>

          <li>
            <a
              href="/"
              onClick={() => (!address ? loadWeb3Modal() : onboard.walletReset)}
              onMouseEnter={() => setLogout(true)}
              onMouseLeave={() => setLogout(false)}
              className={address ? 'button-nav connected' : 'button-nav'}
            >
              {!address ? 'Connect Wallet' : logout ? 'Disconnect' : ellipsedAddress}
            </a>
          </li>
        </Navigation>
      )}
    </Container>
  );
}

export default Header;
