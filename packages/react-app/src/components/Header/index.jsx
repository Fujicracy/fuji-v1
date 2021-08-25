import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'hooks';
import { Image, Box } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import {
  downArrowIcon,
  upArrowIcon,
  logoTitleIcon,
  logoIcon,
  menuCollapseIcon,
} from 'assets/images';
import { Label } from 'components/UI';
import { LANDING_URL, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts/globals';
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
  // const [logout, setLogout] = useState(false);
  const [isOpenWallet, setIsOpenWallet] = useState(false);

  // const { address, loadWeb3Modal, onboard, wallet } = useAuth();
  const { address, onboard, balance } = useAuth();
  const ellipsedAddress = address ? address.substr(0, 6) + '...' + address.substr(-4, 4) : '';
  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  console.log({ isMobile, isTablet });
  return (
    <Container>
      <a href={LANDING_URL} style={{ lineHeight: '10px' }}>
        <Logo
          alt="logo"
          src={isMobile || isTablet ? logoIcon : logoTitleIcon}
          width={isMobile ? '28px' : isTablet ? '48px' : '135px'}
        />
      </a>

      {address &&
        (isMobile || isTablet ? (
          <Image
            src={menuCollapseIcon}
            width={isMobile ? '28px' : '40px'}
            height={isMobile ? '16px' : '24px'}
          />
        ) : (
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
                <Label color="#f5f5f5">{`${balance} ETH`}</Label>
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
                    <Image src={isOpenWallet ? upArrowIcon : downArrowIcon} ml={2} width={11} />
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

            {/* <li>
            <a
              href="/"
              onClick={() => (!address ? loadWeb3Modal() : onboard.walletReset)}
              onMouseEnter={() => setLogout(true)}
              onMouseLeave={() => setLogout(false)}
              className={address ? 'button-nav connected' : 'button-nav'}
            >
              {!address ? 'Connect Wallet' : logout ? 'Disconnect' : ellipsedAddress}
            </a>
          </li> */}
          </Navigation>
        ))}
    </Container>
  );
}

export default Header;
