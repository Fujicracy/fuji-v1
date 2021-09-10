import React, { useState } from 'react';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, MARKET_NAMES, FUSE_DASHBOARD_URL, MARKETS } from 'consts';

import { RadioContainer, MarketButton } from './styles';

const SelectMarket = ({ handleChange, hasBlackContainer = true }) => {
  const [market, setMarket] = useState(MARKET_NAMES.CORE);
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const onClickMarket = option => {
    setMarket(MARKET_NAMES.CORE);
    if (option === MARKET_NAMES.FUSE) {
      window.open(FUSE_DASHBOARD_URL, '_blank');
    }
    if (handleChange) handleChange(option);
  };

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
      <SectionTitle
        fontSize={isMobile ? '16px' : isTablet ? '20px' : '16px'}
        mb={isMobile ? '16px' : '20px'}
      >
        Markets
      </SectionTitle>
      <RadioContainer>
        <MarketButton
          left
          clicked={market === MARKET_NAMES.CORE}
          onClick={() => onClickMarket(MARKET_NAMES.CORE)}
        >
          <Image src={MARKETS[MARKET_NAMES.CORE].icon} width={isMobile ? 10 : 12} mr={2} />
          Core
        </MarketButton>
        <MarketButton
          right
          clicked={market === MARKET_NAMES.FUSE}
          onClick={() => onClickMarket(MARKET_NAMES.FUSE)}
        >
          <Image src={MARKETS[MARKET_NAMES.FUSE].icon} width={isMobile ? 14 : 16} mr={2} />
          Fuse
        </MarketButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectMarket;
