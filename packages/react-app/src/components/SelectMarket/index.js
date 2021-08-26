import React, { useState } from 'react';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { ethIcons, maticIcons } from 'assets/images';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { RadioContainer, MarketButton } from './styles';

const SelectMarket = ({ hasBlackContainer = true }) => {
  const [network, setNetwork] = useState('ETH');
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber });

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
      <SectionTitle fontSize={isMobile ? '14px' : isTablet ? '18px' : '16px'} mb={isMobile ? 2 : 3}>
        Markets
      </SectionTitle>
      <RadioContainer>
        <MarketButton left clicked={network === 'ETH'} onClick={() => setNetwork('ETH')}>
          <Image src={ethIcons.GRAY} width={isMobile ? 10 : 12} mr={2} />
          Main
        </MarketButton>
        <MarketButton right clicked={network === 'MATIC'} onClick={() => setNetwork('MATIC')}>
          <Image src={maticIcons.GRAY} width={isMobile ? 14 : 20} height={20} mr={2} />
          Fuse
        </MarketButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectMarket;
