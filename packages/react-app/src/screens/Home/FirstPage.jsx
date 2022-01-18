import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { SectionTitle, Animation, Button } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, APP_URL } from 'consts';
import { useWindowSize } from 'hooks';

import { calcResponsiveSize } from 'helpers';

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

  const windowDimensions = useWindowSize();

  const designDimension = {
    width: isMobile ? 375 : isTablet ? 768 : 1440,
    height: isMobile ? 812 : isTablet ? 1024 : 1024,
  };

  const ratio = {
    xAxios: Math.min(windowDimensions.width / designDimension.width, 1),
    yAxios: Math.min(windowDimensions.height / designDimension.height, 1),
  };

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      <HomeAnimatedContainer style={props}>
        <Image
          src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding1}
          height={isMobile || isTablet ? '40vh' : '64vh'}
        />
        {(isMobile || isTablet) && (
          <SectionTitle
            fontWeight="700"
            fontSize={isMobile || isTablet ? calcResponsiveSize(ratio, 70) : 70}
            textAlign="center"
            m="6vh 0px 4px"
            fontFamily="Nexa Regular"
          >
            FujiDAO
          </SectionTitle>
        )}
        <SectionTitle
          fontWeight="400"
          fontSize={calcResponsiveSize(ratio, isMobile ? 24 : 28)}
          textAlign="center"
          lineHeight="130%"
          m="3vh 0px 4vh"
          fontFamily="Nexa Regular"
        >
          The Auto-Refinancing{isMobile && <br />} Borrow Protocol
        </SectionTitle>
        {(isMobile || isTablet) && (
          <Flex width="100%" padding={isMobile ? '3vh 36px 5vh' : '3vh 92px 5vh'}>
            <Button
              block
              color="white"
              fontSize={calcResponsiveSize(ratio, isTablet ? 24 : 18)}
              height={calcResponsiveSize(ratio, isMobile ? 48 : 60)}
              onClick={() => {
                window.location = `${APP_URL}/#/dashboard`;
              }}
              noResizeOnResponsive
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
