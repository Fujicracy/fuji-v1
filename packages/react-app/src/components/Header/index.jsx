import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks';
import { Image, Box, Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { useSpring, animated } from 'react-spring';

import { downArrowIcon, upArrowIcon, logoTitleIcon, logoIcon } from 'assets/images';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import MenuOpenOutlinedIcon from '@material-ui/icons/MenuOpenOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { Label, NavImageLink } from 'components/UI';

import { CONTACTS } from 'consts/contacts';
import map from 'lodash/map';

import { LANDING_URL, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts/globals';
import {
  Container,
  Logo,
  Navigation,
  BallanceContainer,
  WalletItemContainer,
  WalletHeader,
  WalletItem,
  MenuContainer,
  HeaderContainer,
  MenuItem,
  MenuBackContainer,
  MenuNavigationContainer,
} from './styles';

function Header() {
  // const [logout, setLogout] = useState(false);
  const [isOpenWallet, setIsOpenWallet] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // const { address, loadWeb3Modal, onboard, wallet } = useAuth();
  const { address, onboard, balance } = useAuth();
  const ellipsedAddress = address ? address.substr(0, 6) + '...' + address.substr(-4, 4) : '';
  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const props = useSpring({
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? `translate(0)` : `translateX(100%)`,
  });

  const currentPage = useLocation();

  return (
    <Container>
      {isMenuOpen && (
        <MenuBackContainer onClick={() => setIsMenuOpen(false)}>
          <animated.div style={props}>
            <MenuContainer
              style={props}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <Flex flexDirection="column" padding="20px 20px 40px 40px">
                <Flex flexDirection="row" justifyContent="flex-end">
                  <CloseOutlinedIcon
                    style={{ color: 'white', fontSize: 40, padding: 0, margin: 0 }}
                    onClick={e => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  />
                </Flex>
                <NavLink to="/dashboard/init-borrow">
                  <MenuItem
                    isSelected={currentPage.pathname === '/dashboard/init-borrow'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Borrow
                  </MenuItem>
                </NavLink>

                <NavLink to="/dashboard/my-positions">
                  <MenuItem
                    isSelected={currentPage.pathname === '/dashboard/my-positions'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My positions
                  </MenuItem>
                </NavLink>

                <NavLink to="/about">
                  <MenuItem
                    isSelected={currentPage.pathname === '/about'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </MenuItem>
                </NavLink>
                <MenuItem
                  isSelected={false}
                  onClick={() => {
                    window.open('https://docs.fujidao.org', '_blank');
                  }}
                >
                  Documentation
                </MenuItem>

                {/* <MenuItem>Claim My NFT</MenuItem> */}
              </Flex>
            </MenuContainer>
            <MenuNavigationContainer>
              {map(Object.keys(CONTACTS), key => (
                <NavImageLink key={key} contact={CONTACTS[key]} />
              ))}
            </MenuNavigationContainer>
          </animated.div>
        </MenuBackContainer>
      )}
      <HeaderContainer>
        <a href={LANDING_URL} style={{ lineHeight: '10px', height: '100%' }}>
          <Logo
            alt="logo"
            src={isMobile || isTablet ? logoIcon : logoTitleIcon}
            width={isMobile ? '32px' : isTablet ? '38px' : '135px'}
          />
        </a>

        {address &&
          (isMobile || isTablet ? (
            isMenuOpen ? (
              <MenuOutlinedIcon
                style={{ color: 'white', fontSize: 40, padding: 0, margin: 0 }}
                onClick={e => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
            ) : (
              <MenuOpenOutlinedIcon
                style={{ color: '#F5F5FD', fontSize: 40, padding: 0, margin: 0 }}
                onClick={e => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
              />
            )
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
                        <WalletItem onClick={() => onboard.walletSelect()}>
                          Change Wallet
                        </WalletItem>
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
            </Navigation>
          ))}
      </HeaderContainer>
    </Container>
  );
}

export default Header;
