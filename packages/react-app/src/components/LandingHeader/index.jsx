import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, LANDING_URL } from 'consts';
import { Button } from 'components/UI';
import { logoTitleIcon, logoIcon } from 'assets/images';

import { Container, HeaderContainer, Logo } from './styles';

function LandingHeader({ isShowLogo }) {
  const isMobile = useMediaQuery({
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
  });

  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  console.log({ isMobile, isTablet });
  return (
    <Container>
      <HeaderContainer isShowLogo={isShowLogo}>
        {isShowLogo && (
          <a href={LANDING_URL} style={{ lineHeight: '10px', height: '100%' }}>
            <Logo
              alt="logo"
              src={isMobile || isTablet ? logoIcon : logoTitleIcon}
              width={isMobile ? '32px' : isTablet ? '38px' : '135px'}
            />
          </a>
        )}
        <NavLink to="/dashboard" activeClassName="current">
          <Button
            block
            outline
            color="white"
            fontSize="16px"
            borderRadius="64"
            background="linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 0.01%, rgba(16, 16, 16, 0) 100%)"
            fontFamily="Nexa Regular"
          >
            Go to App
          </Button>
        </NavLink>
      </HeaderContainer>
    </Container>
  );
}

export default LandingHeader;
