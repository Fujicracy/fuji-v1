import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, useBalance, useContractLoader } from 'hooks';
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
import { formatUnits } from '@ethersproject/units';
import {
  LANDING_URL,
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  CHAIN_NAMES,
  ASSETS,
  DEFAULT_BALANCE_ASSET,
  CHAINS,
  CHAIN_NAME,
} from 'consts';

import { getUserBalance } from 'helpers';
import { flow } from 'lodash';

import {
  Container,
  Logo,
  Navigation,
  BallanceContainer,
  DropDownItemContainer,
  DropDownHeader,
  DropDownItem,
  MenuContainer,
  HeaderContainer,
  MenuItem,
  MenuBackContainer,
  MenuNavigationContainer,
} from './styles';

function Header() {
  const { address, provider, onboard } = useAuth();
  const contracts = useContractLoader(provider);

  const [isOpenWalletDropDown, setIsOpenWalletDropDown] = useState(false);
  const [isOpenNetworkDropDown, setIsOpenNetworkDropDown] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const pollUnformattedBalance = useBalance(provider, address, contracts);

  const chains = flow([
    Object.entries,
    arr => arr.filter(([key]) => CHAINS[key].isDeployed && CHAINS[key].id !== CHAIN_NAME),
    Object.fromEntries,
  ])(CHAINS);

  useEffect(() => {
    async function fetchBalance() {
      const unFormattedBalance = await getUserBalance(provider, address, contracts);

      const formattedBalance = unFormattedBalance
        ? Number(formatUnits(unFormattedBalance, ASSETS[DEFAULT_BALANCE_ASSET].decimals)).toFixed(6)
        : null;

      setBalance(Number(formattedBalance).toFixed(2));
    }

    fetchBalance();
  }, [address, provider, contracts, pollUnformattedBalance]);

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

                {CHAIN_NAME === CHAIN_NAMES.ETHEREUM && (
                  <NavLink to="/claim-nft">
                    <MenuItem
                      isSelected={currentPage.pathname === '/dashboard/claim-nft'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Claim My NFT
                    </MenuItem>
                  </NavLink>
                )}
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
              {CHAIN_NAME === CHAIN_NAMES.ETHEREUM && (
                <li className="nav-item">
                  <NavLink to="/claim-nft" activeClassName="current">
                    NFT
                  </NavLink>
                </li>
              )}

              <li>
                <Box
                  ml={2}
                  sx={{ position: 'relative' }}
                  tabIndex="0"
                  onBlur={() => setIsOpenNetworkDropDown(false)}
                >
                  <DropDownHeader
                    onClick={() => setIsOpenNetworkDropDown(!isOpenNetworkDropDown)}
                    isClicked={isOpenNetworkDropDown}
                    hasBorder
                    width="160px"
                  >
                    <Image src={CHAINS[CHAIN_NAME].icon} width={20} />
                    <Label ml={2} color="#f5f5f5">
                      {CHAINS[CHAIN_NAME].name}
                    </Label>
                    <Image
                      src={isOpenNetworkDropDown ? upArrowIcon : downArrowIcon}
                      ml={2}
                      width={11}
                    />
                  </DropDownHeader>
                  {isOpenNetworkDropDown && (
                    <DropDownItemContainer width="128px">
                      {Object.keys(chains).map(key => (
                        <DropDownItem
                          key={key}
                          onClick={() => {
                            window.open(chains[key].dashboardUrl, '_self');
                          }}
                        >
                          <Image src={chains[key].icon} width={16} />
                          <Label color="#f5f5f5" ml="8px">
                            {chains[key].name}
                          </Label>
                        </DropDownItem>
                      ))}
                    </DropDownItemContainer>
                  )}
                </Box>
              </li>

              <li>
                <BallanceContainer rightPadding={0} onBlur={() => setIsOpenWalletDropDown(false)}>
                  <Label color="#f5f5f5">{`${balance} ${DEFAULT_BALANCE_ASSET}`}</Label>
                  <Box
                    ml={2}
                    sx={{ position: 'relative' }}
                    tabIndex="0"
                    onBlur={() => setIsOpenWalletDropDown(false)}
                  >
                    <DropDownHeader
                      onClick={() => setIsOpenWalletDropDown(!isOpenWalletDropDown)}
                      isClicked={isOpenWalletDropDown}
                    >
                      <Label color="#f5f5f5">{ellipsedAddress}</Label>
                      <Image
                        src={isOpenWalletDropDown ? upArrowIcon : downArrowIcon}
                        ml={2}
                        width={11}
                      />
                    </DropDownHeader>
                    {isOpenWalletDropDown && (
                      <DropDownItemContainer>
                        <DropDownItem onClick={() => onboard.walletSelect()}>
                          Change Wallet
                        </DropDownItem>
                        <DropDownItem
                          onClick={() => {
                            setIsOpenWalletDropDown(false);
                            onboard.walletReset();
                          }}
                        >
                          Disconnect
                        </DropDownItem>
                      </DropDownItemContainer>
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
