import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiLanding2, fujiLandingMobile, fujiLandingTablet } from '../../assets/images';

import { HomeContainer } from './styles';

function Home() {
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
        {isMobile && (
          <SectionTitle fontWeight="600" fontSize="20px" m={3} mb={3}>
            The first DeFi Borrowing Aggregator
          </SectionTitle>
        )}
        <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding2} />
      </HomeContainer>
    </Flex>
  );
}

export default Home;
