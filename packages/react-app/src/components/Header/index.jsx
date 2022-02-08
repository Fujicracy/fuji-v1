import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, useBalance, useContractLoader } from 'hooks';
import { Image, Box, Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { useSpring, animated } from 'react-spring';
import { useTranslation, Trans } from 'react-i18next';

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
  DEFAULT_BALANCE_ASSET,
} from 'consts';

import LanguageDropdown from '../LanguageDropdown';
import NetworkDropdown from '../NetworkDropdown';
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
  const { address, provider, onboard, networkName } = useAuth();
  const contracts = useContractLoader();
  const defaultAsset = DEFAULT_BALANCE_ASSET[networkName];

  const [isOpenWalletDropDown, setIsOpenWalletDropDown] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const userBalance = useBalance(provider, address, contracts);

  useEffect(() => {
    function formatBalance() {
      const bal = Number(formatUnits(userBalance, defaultAsset.decimals)).toFixed(2);
      setBalance(bal);
    }

    if (userBalance) formatBalance();
  }, [defaultAsset, userBalance]);

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
  const { t } = useTranslation();

  const menuIconStyle = {
    color: 'white',
    fontSize: 40,
    padding: 0,
    marginLeft: isTablet ? 40 : 20,
  };

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
                    <Trans i18nKey="global.borrow" t={t}>
                      Borrow
                    </Trans>
                  </MenuItem>
                </NavLink>

                <NavLink to="/dashboard/my-positions">
                  <MenuItem
                    isSelected={currentPage.pathname === '/dashboard/my-positions'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Trans i18nKey="global.myPositions" t={t}>
                      My positions
                    </Trans>
                  </MenuItem>
                </NavLink>

                <NavLink to="/about">
                  <MenuItem
                    isSelected={currentPage.pathname === '/about'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Trans i18nKey="footer.about" t={t}>
                      About
                    </Trans>
                  </MenuItem>
                </NavLink>
                <MenuItem
                  isSelected={false}
                  onClick={() => {
                    window.open('https://docs.fujidao.org', '_blank');
                  }}
                >
                  <Trans i18nKey="footer.documentation" t={t}>
                    Documentation
                  </Trans>
                </MenuItem>

                {selectedChain?.name === CHAIN_NAMES.ETHEREUM && (
                  <NavLink to="/claim-nft">
                    <MenuItem
                      isSelected={currentPage.pathname === '/dashboard/claim-nft'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Trans i18nKey="header.claimMyNft" t={t}>
                        Claim My NFT
                      </Trans>
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
            <Flex flexDirection="row" alignItems="center">
              <NetworkDropdown onChangeNetwork={setSelectedChain} />
              {isMenuOpen ? (
                <MenuOutlinedIcon
                  style={menuIconStyle}
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                />
              ) : (
                <MenuOpenOutlinedIcon
                  style={menuIconStyle}
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                />
              )}
            </Flex>
          ) : (
            <Navigation>
              {selectedChain && (
                <>
                  <li className="nav-item">
                    <NavLink to="/dashboard/init-borrow" activeClassName="current">
                      <Trans i18nKey="global.borrow" t={t}>
                        Borrow
                      </Trans>
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/dashboard/my-positions" activeClassName="current">
                      <Trans i18nKey="global.myPositions" t={t}>
                        My positions
                      </Trans>
                    </NavLink>
                  </li>
                </>
              )}
              {selectedChain?.name === CHAIN_NAMES.ETHEREUM && (
                <li className="nav-item">
                  <NavLink to="/claim-nft" activeClassName="current">
                    NFT
                  </NavLink>
                </li>
              )}

              <li>
                <NetworkDropdown onChangeNetwork={setSelectedChain} />
              </li>

              <li>
                <BallanceContainer rightPadding={0} onBlur={() => setIsOpenWalletDropDown(false)}>
                  <Label color="#f5f5f5">{`${balance} ${defaultAsset.name}`}</Label>
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
                          <Trans i18nKey="header.disconnect" t={t}>
                            Disconnect
                          </Trans>
                        </DropDownItem>
                      </DropDownItemContainer>
                    )}
                  </Box>
                </BallanceContainer>
              </li>

              <li>
                <LanguageDropdown />
              </li>
            </Navigation>
          ))}
      </HeaderContainer>
    </Container>
  );
}

export default Header;
