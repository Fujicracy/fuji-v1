import React from 'react';
import { useSpring, config } from 'react-spring';
import { HomepageTitle, SectionTitle } from 'components';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { fujiAlice1, fujiLandingMobile, fujiLandingTablet } from '../../assets/images';

import { HomeContainer } from './styles';

function SecondPage() {
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
    <Flex flexDirection="column" justifyContent="center" alignItems="center" marginTop="104px">
      <HomeContainer style={props}>
        <Flex flexDirection="row" alignItems="center">
          <Image src={isMobile ? fujiLandingMobile : isTablet ? fujiLandingTablet : fujiAlice1} />
          <Flex flexDirection="column" width="660px" marginLeft="56px">
            <HomepageTitle
              firstWord="Borrow Rates"
              secondWord="Fluctuate"
              thirdWord="All The Time"
            />

            <SectionTitle
              fontWeight="normal"
              fontSize="24px"
              textAlign="left"
              lineHeight="130%"
              fontFamily="Nexa Regular"
            >
              <br />
              Ever borrowed in DeFi? Taking out a loan at 5%
              <br /> and paying 15% shortly after is an everyday reality. <br />
              <br />
              Manually comparing loan providers is a tedious task, refinancing as rates change is
              expensive in gas and time.
            </SectionTitle>
          </Flex>
        </Flex>
      </HomeContainer>
    </Flex>
  );
}

export default SecondPage;
