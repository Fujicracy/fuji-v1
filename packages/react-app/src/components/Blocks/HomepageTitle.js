import React from 'react';
import { Flex } from 'rebass';
import SectionTitle from './SectionTitle';

function HomepageTitle({ firstWord, secondWord, thirdWord }) {
  return (
    <Flex flexDirection="column" fontFamily="Nexa Bold">
      <SectionTitle fontWeight="bold" fontSize="48px" textAlign="center" lineHeight="100%">
        {firstWord}
      </SectionTitle>

      <SectionTitle
        fontWeight="bold"
        fontSize="48px"
        textAlign="center"
        lineHeight="100%"
        spanColor="rgb(254, 52, 119)"
        spanMargin="0px"
      >
        <span>{secondWord}</span>&nbsp; {thirdWord}
      </SectionTitle>
    </Flex>
  );
}

export default HomepageTitle;
