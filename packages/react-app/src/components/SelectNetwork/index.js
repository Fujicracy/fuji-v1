import React, { useState } from 'react';
// import { map } from 'lodash';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { Image } from 'rebass';
import { ethIcons, maticIcons, comingSoonIcon } from 'assets/images';
// import { comingSoonIcon } from 'assets/images';
import { RadioContainer, NetworkButton } from './styles';

const SelectNetwork = ({ hasBlackContainer = true }) => {
  const [network, setNetwork] = useState('ETH');

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
      <SectionTitle fontSize={2} mb={3}>
        Network
      </SectionTitle>
      <RadioContainer>
        <NetworkButton left clicked={network === 'ETH'} onClick={() => setNetwork('ETH')}>
          <Image src={ethIcons.GRAY} width={12} height={26} mr={2} />
          Ethereum
        </NetworkButton>
        <NetworkButton right clicked={network === 'MATIC'}>
          <Image src={maticIcons.GRAY} width={22} height={20} mr={2} />
          Matic
          <Image src={comingSoonIcon} width={30} />
        </NetworkButton>
      </RadioContainer>
    </BlackBoxContainer>
  );
};

export default SelectNetwork;
