import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { SectionTitle, Animation } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import {
  fujiLanding1,
  fujiLandingMobile,
  fujiLandingTablet,
  scrollDownAnimation,
} from '../../assets/images';

import { HomeContainer } from './styles';

function FirstPage() {
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

  // const handleLearnClick = () => {
  //   window.open('https://docs.fujidao.org/', '_blank');
  // };

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <HomeContainer style={props}>
        <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding1} />
        <SectionTitle
          fontWeight="400"
          fontSize="28px"
          textAlign="center"
          m="24px 0px 36px"
          fontFamily="Nexa Regular"
        >
          The Auto-Refinancing Borrow Protocol
        </SectionTitle>
        <Animation
          jsonAnimationData={scrollDownAnimation}
          isStopped={false}
          isPaused={false}
          width={46}
          height={80}
        />
      </HomeContainer>
    </Flex>
  );
}

export default FirstPage;
