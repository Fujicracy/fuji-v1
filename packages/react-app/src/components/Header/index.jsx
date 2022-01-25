import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth, useBalance, useContractLoader } from 'hooks';
import { Image, Box, Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { useSpring, animated } from 'react-spring';
import ReactCountryFlag from 'react-country-flag';

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
  CHAINS,
  LANGUAGES,
  LANGUAGE_NAMES,
} from 'consts';

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
  DropDownBackContainer,
} from './styles';

function Header() {
  const { address, provider, onboard, networkName, networkId, changeNetwork } = useAuth();
  const contracts = useContractLoader();
  const defaultAsset = DEFAULT_BALANCE_ASSET[networkName];

  const chains = flow([
    Object.entries,
    arr => arr.filter(([key]) => CHAINS[key].isDeployed),
    Object.fromEntries,
  ])(CHAINS);

  const [isOpenWalletDropDown, setIsOpenWalletDropDown] = useState(false);
  const [isOpenNetworkDropDown, setIsOpenNetworkDropDown] = useState(false);
  const [isOpenLanguageDropDown, setIsOpenLanguageDropDown] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [selectedChain, setSelectedChain] = useState(chains[networkName]);

  const userBalance = useBalance(provider, address, contracts);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (Object.values(chains).find(chain => chain.id === networkId)) {
      setSelectedChain(chains[networkName]);
    } else {
      setSelectedChain(null);
    }
  }, [chains, networkName, networkId]);

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

  const onChangeChain = async chain => {
    await changeNetwork(chain.id);
    setSelectedChain(chain);
  };

  const [selectedLanguage, setSelectedLanugage] = useState(LANGUAGES[LANGUAGE_NAMES.EN]);

  const NetworkDropdown = () => {
    return (
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
          width={!isMobile ? '160px' : '80px'}
        >
          <Image src={selectedChain?.icon} width={20} />
          {isMobile ? (
            <Label ml={2}>{!selectedChain ? 'Switch' : ''}</Label>
          ) : (
            <Label ml={2} color="#f5f5f5">
              {selectedChain?.title ?? 'Switch network'}
            </Label>
          )}
          <Image src={isOpenNetworkDropDown ? upArrowIcon : downArrowIcon} ml={2} width={11} />
        </DropDownHeader>
        {isOpenNetworkDropDown && (
          <DropDownBackContainer onClick={() => setIsOpenNetworkDropDown(false)}>
            <DropDownItemContainer width={!isMobile && !isTablet ? '128px' : '100%'}>
              {Object.keys(chains)
                .filter(key => key !== selectedChain?.name)
                .map(key => (
                  <DropDownItem key={key} onClick={() => onChangeChain(chains[key])}>
                    <Image src={chains[key].icon} width={16} />
                    <Label color="#f5f5f5" ml="8px">
                      {chains[key].title}
                    </Label>
                  </DropDownItem>
                ))}
            </DropDownItemContainer>
          </DropDownBackContainer>
        )}
      </Box>
    );
  };

  const onChangeLanguage = async lng => {
    console.log({ lng, LANGUAGES });
    i18n.changeLanguage(lng.alpha2);
    setSelectedLanugage(lng);
  };

  const LanguageDropdown = () => {
    return (
      <Box
        ml={2}
        sx={{ position: 'relative' }}
        tabIndex="0"
        onBlur={() => setIsOpenLanguageDropDown(false)}
      >
        <DropDownHeader
          onClick={() => setIsOpenLanguageDropDown(!isOpenLanguageDropDown)}
          isClicked={isOpenLanguageDropDown}
          hasBorder
          width={!isMobile ? '160px' : '80px'}
        >
          <Flex justifyContent="center" alignItems="center">
            <ReactCountryFlag countryCode={selectedLanguage?.flag} />
            {isMobile ? (
              <Label ml={2}>{!selectedChain ? 'Switch' : ''}</Label>
            ) : (
              <Label ml={2} color="#f5f5f5">
                {/* {selectedChain?.title ?? 'Switch network'} */}
                {selectedLanguage?.label}
              </Label>
            )}
          </Flex>
          <Image src={isOpenLanguageDropDown ? upArrowIcon : downArrowIcon} ml={2} width={11} />
        </DropDownHeader>
        {isOpenLanguageDropDown && (
          <DropDownBackContainer onClick={() => setIsOpenLanguageDropDown(false)}>
            <DropDownItemContainer width={!isMobile && !isTablet ? '128px' : '100%'}>
              {Object.keys(LANGUAGES)
                .filter(key => key !== selectedLanguage?.label)
                .map(key => (
                  <DropDownItem key={key} onClick={() => onChangeLanguage(LANGUAGES[key])}>
                    <ReactCountryFlag countryCode={LANGUAGES[key].flag} />
                    <Label color="#f5f5f5" ml="8px">
                      {LANGUAGES[key].label}
                    </Label>
                  </DropDownItem>
                ))}
            </DropDownItemContainer>
          </DropDownBackContainer>
        )}
      </Box>
    );
  };

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

                {selectedChain?.name === CHAIN_NAMES.ETHEREUM && (
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
            <Flex flexDirection="row" alignItems="center">
              <NetworkDropdown />
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
                      Borrow
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/dashboard/my-positions" activeClassName="current">
                      My positions
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
                <LanguageDropdown />
              </li>
              <li>
                <NetworkDropdown />
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
