import React from 'react';
import { useSpring, config } from 'react-spring';
// import { Button } from 'components/UI';
// import { Grid } from '@material-ui/core';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiAlice2, fujiLandingMobile, fujiLandingTablet } from 'assets/images';

import { HomeContainer } from './styles';

function FourthPage() {
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
        <Flex flexDirection="row" alignItems="center">
          <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiAlice2} />

          <Flex flexDirection="column" width="360px" marginLeft="-360px">
            <HomepageTitle firstWord="All-in-One" secondWord="Smart" thirdWord="Borrow" />

            <SectionTitle
              fontWeight="normal"
              fontSize="24px"
              textAlign="left"
              lineHeight="170%"
              fontFamily="Nexa Regular"
            >
              <br />
              &bull; Aggregated Borrow APR <br />
              &bull; Automatic Loan Refinancing
              <br />
              &bull; Non-Custodial Loan Routing <br />
              &bull; Rebates On Gas Costs
            </SectionTitle>
          </Flex>
        </Flex>
      </HomeContainer>
    </Flex>
  );
}

export default FourthPage;
