import React, { useState } from 'react';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { ethIcons, maticIcons } from 'assets/images';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { RadioContainer, MarketButton } from './styles';

const MARKETS = {
  Main: 'Main',
  Fuse: 'Fuse',
};
const SelectMarket = ({ hasBlackContainer = true }) => {
  const [market, setMarket] = useState('Main');
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const onClickMarket = option => {
    setMarket(option);
    if (option === MARKETS.Fuse) {
      window.location.href = 'https://fuse.fujidao.org/';
    }
  };

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
      <SectionTitle fontSize={isMobile ? '14px' : isTablet ? '18px' : '16px'} mb={isMobile ? 3 : 3}>
        Markets
      </SectionTitle>
      <RadioContainer>
        <MarketButton
          left
          clicked={market === MARKETS.Main}
          onClick={() => onClickMarket(MARKETS.Main)}
        >
          <Image src={ethIcons.GRAY} width={isMobile ? 10 : 12} mr={2} />
          Main
        </MarketButton>
        <MarketButton
          right
          clicked={market === MARKETS.Fuse}
          onClick={() => onClickMarket(MARKETS.Fuse)}
        >
          <Image src={maticIcons.GRAY} width={isMobile ? 14 : 20} height={20} mr={2} />
          Fuse
        </MarketButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectMarket;
