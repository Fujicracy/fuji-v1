import React from 'react';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, MARKETS, DEPLOYMENT, DEPLOYMENT_TYPES } from 'consts';

import { RadioContainer, MarketButton } from './styles';

const SelectMarket = ({ handleChange, hasBlackContainer = true }) => {
  const currrentMakret = MARKETS[DEPLOYMENT];
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const onClickMarket = option => {
    window.open(MARKETS[option].dashboardUrl, '_self');
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
          clicked={currrentMakret.id === DEPLOYMENT_TYPES.CORE}
          onClick={() => onClickMarket(DEPLOYMENT_TYPES.CORE)}
        >
          <Image src={MARKETS[DEPLOYMENT_TYPES.CORE].icon} width={isMobile ? 10 : 12} mr={2} />
          Core
        </MarketButton>
        <MarketButton
          right
          clicked={currrentMakret.id === DEPLOYMENT_TYPES.FUSE}
          onClick={() => onClickMarket(DEPLOYMENT_TYPES.FUSE)}
        >
          <Image src={MARKETS[DEPLOYMENT_TYPES.FUSE].icon} width={isMobile ? 14 : 16} mr={2} />
          Fuse
        </MarketButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectMarket;
