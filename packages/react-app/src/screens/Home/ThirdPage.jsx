import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiLanding2, fujiLandingMobile, fujiLandingTablet } from '../../assets/images';

import { HomeContainer, PageContainter } from './styles';

function ThirdPage() {
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
    <PageContainter>
      <HomeContainer style={props}>
        <Flex flexDirection="row" alignItems="center">
          <Flex flexDirection="column" width="690px" marginRight="16px">
            <HomepageTitle
              firstWord="Fuji Constantly"
              secondWord="Scans"
              thirdWord="Borrow Markets"
            />

            <SectionTitle
              fontWeight="normal"
              fontSize="24px"
              textAlign="left"
              lineHeight="130%"
              fontFamily="Nexa Regular"
            >
              <br />
              Routing your loan through Fuji ensures you get
              <br /> the best borrow rate, aggregated across all providers.
              <br />
              <br />
              Better opportunity? The protocol automatically
              <br /> refinances the whole pool of loans to the new lowest APR.
            </SectionTitle>
          </Flex>
          <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiLanding2} />
        </Flex>
      </HomeContainer>
    </PageContainter>
  );
}

export default ThirdPage;
