import React from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import SectionTitle from './SectionTitle';

function HomepageTitle({ firstWord, secondWord, thirdWord, fourthWord }) {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  console.log({ isMobile, isTablet });

  return (
    <Flex flexDirection="column" fontFamily="Nexa Bold">
      <SectionTitle
        fontWeight="bold"
        fontSize={isMobile ? '44px' : '48px'}
        textAlign="center"
        lineHeight="100%"
      >
        {firstWord}
      </SectionTitle>

      <SectionTitle
        fontWeight="bold"
        fontSize={isMobile ? '44px' : '48px'}
        textAlign="center"
        lineHeight="100%"
        spanColor="rgb(254, 52, 119)"
        spanMargin="0px"
      >
        <span>{secondWord}</span>&nbsp; {thirdWord}
      </SectionTitle>
      {!!fourthWord && (
        <SectionTitle
          fontWeight="bold"
          fontSize={isMobile ? '44px' : '48px'}
          textAlign="center"
          lineHeight="100%"
          spanColor="rgb(254, 52, 119)"
          spanMargin="0px"
        >
          {fourthWord}
        </SectionTitle>
      )}
    </Flex>
  );
}

export default HomepageTitle;
