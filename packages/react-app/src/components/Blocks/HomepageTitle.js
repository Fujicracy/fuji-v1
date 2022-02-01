import React from 'react';
import { Flex } from 'rebass';
import SectionTitle from './SectionTitle';

function HomepageTitle({ firstWord, secondWord, thirdWord, fourthWord, fontSize }) {
  return (
    <Flex flexDirection="column" fontFamily="Nexa Bold">
      <SectionTitle fontWeight="bold" fontSize={fontSize} textAlign="center" lineHeight="100%">
        {firstWord}
      </SectionTitle>

      <SectionTitle
        fontWeight="bold"
        fontSize={fontSize}
        textAlign="center"
        lineHeight="100%"
        spanColor="rgb(254, 52, 119)"
        spanMargin="0px"
      >
        <span>{secondWord}</span>&nbsp;{thirdWord}
      </SectionTitle>
      {!!fourthWord && (
        <SectionTitle
          fontWeight="bold"
          fontSize={fontSize}
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
