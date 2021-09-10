import React from 'react';
import { useSpring, config } from 'react-spring';
import { Button } from 'components/UI';
import { NavLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiLanding, fujiLandingMobile, fujiLandingTablet } from '../../assets/images';

import { HomeContainer, HomeCta } from './styles';

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

  const handleLearnClick = () => {
    window.open('https://docs.fujidao.org/', '_blank');
  };

  return (
    <Flex flexDireciton="column" justifyContent="center" alignItems="center" height="100vh">
      <HomeContainer style={props}>
        {isMobile && (
          <SectionTitle fontWeight="600" fontSize="20px" m={3} mb={3}>
            The first DeFi Borrowing Aggregator
          </SectionTitle>
        )}
        <Image
          src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding}
          mt={2}
          p={!isMobile && !isTablet && '48px 40px 0px'}
        />
        <HomeCta container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Button onClick={handleLearnClick} block outline fontSize="18px">
              Learn
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <NavLink to="/dashboard">
              <Button block color="white" fontSize="18px">
                App
              </Button>
            </NavLink>
          </Grid>
        </HomeCta>
      </HomeContainer>
    </Flex>
  );
}

export default Home;
