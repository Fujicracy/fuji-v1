import React, { useState } from 'react';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { ethIcons, maticIcons, comingSoonIcon } from 'assets/images';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { RadioContainer, NetworkButton } from './styles';

const SelectNetwork = ({ hasBlackContainer = true }) => {
  const [network, setNetwork] = useState('ETH');
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
      <SectionTitle fontSize={isMobile ? 1 : 2} mb={3}>
        Network
      </SectionTitle>
      <RadioContainer>
        <NetworkButton left clicked={network === 'ETH'} onClick={() => setNetwork('ETH')}>
          <Image src={ethIcons.GRAY} width={isMobile ? 8 : 12} mr={2} />
          Ethereum
        </NetworkButton>
        <NetworkButton right clicked={network === 'MATIC'}>
          <Image src={maticIcons.GRAY} width={isMobile ? 12 : 22} height={20} mr={2} />
          Matic
          <Image src={comingSoonIcon} width={isMobile ? 20 : 30} />
        </NetworkButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectNetwork;
