import React from 'react';
import { useAuth } from 'hooks';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES, DEPLOYMENT_TYPES } from 'consts';

import { marketCoreIcon, marketFuseIcon } from 'assets/images';
import { RadioContainer, MarketButton } from './styles';

const SelectMarket = () => {
  const { deployment, setDeployment } = useAuth();

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  return (
    <BlackBoxContainer hasBlackContainer={false}>
      <SectionTitle
        fontSize={isMobile ? '16px' : isTablet ? '20px' : '16px'}
        mb={isMobile ? '16px' : '20px'}
      >
        Markets
      </SectionTitle>
      <RadioContainer>
        <MarketButton
          left
          clicked={deployment === DEPLOYMENT_TYPES.CORE}
          onClick={() => setDeployment(DEPLOYMENT_TYPES.CORE)}
        >
          <Image src={marketCoreIcon.toString()} width={isMobile ? 10 : 12} mr={2} />
          Core
        </MarketButton>
        <MarketButton
          right
          clicked={deployment === DEPLOYMENT_TYPES.FUSE}
          onClick={() => setDeployment(DEPLOYMENT_TYPES.FUSE)}
        >
          <Image src={marketFuseIcon.toString()} width={isMobile ? 14 : 16} mr={2} />
          Fuse
        </MarketButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectMarket;
