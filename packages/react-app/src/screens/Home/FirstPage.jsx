import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { SectionTitle, Animation, Button } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';

import {
  fujiLanding1,
  fujiLandingMobile,
  fujiLandingTablet,
  scrollDownAnimation,
} from 'assets/images';

import { HomeAnimatedContainer } from './styles';

function FirstPage({ onClickAnimation }) {
  const props = useSpring({
    from: {
      factor: 1,
      opacity: 0,
    },
    to: { factor: 150, opacity: 1 },
    config: { duration: 800, ...config.molasses },
  });

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      <HomeAnimatedContainer style={props}>
        <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding1} />
        {(isMobile || isTablet) && (
          <SectionTitle
            fontWeight="700"
            fontSize="48px"
            textAlign="center"
            m="64px 0px 4px"
            fontFamily="Nexa Regular"
          >
            FujiDAO
          </SectionTitle>
        )}
        <SectionTitle
          fontWeight="400"
          fontSize="28px"
          textAlign="center"
          m="24px 0px 36px"
          fontFamily="Nexa Regular"
        >
          The Auto-Refinancing Borrow Protocol
        </SectionTitle>
        {(isMobile || isTablet) && (
          <Flex width="100%" padding={isMobile ? '24px 36px 44px' : '24px 92px 44px'}>
            <Button
              block
              color="white"
              fontSize={isTablet ? '24px' : '18px'}
              height={isTablet ? 64 : 48}
              onClick={() => {
                window.location = `${APP_URL}/#/dashboard`;
              }}
            >
              Go to App
            </Button>
          </Flex>
        )}
        <Animation
          jsonAnimationData={scrollDownAnimation}
          isStopped={false}
          isPaused={false}
          width={46}
          height={80}
          onClick={onClickAnimation}
        />
      </HomeAnimatedContainer>
    </Flex>
  );
}

export default FirstPage;
