import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Flex } from 'rebass';
import { useAuth, useContractLoader, useProfileInfo } from 'hooks';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { BlackBoxContainer, SectionTitle, Description, Bond, BondBalance } from 'components';
import { Transactor } from 'helpers';

function BondFactory() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const { points, isLoading } = useProfileInfo();

  const { provider } = useAuth();
  const contracts = useContractLoader();
  const tx = Transactor(provider);

  // To buy bonds, nftinteractions.mintBonds(uint256 _slotType, uint256 amount)
  const buy = async (days, amount) => {
    // TODO: check points and nb of bonds
    try {
      const res = await tx(contracts.NFTInteractions.mintBonds(days, amount));
    } catch (error) {
      // TODO: Display err
      console.error(error);
    }
  };

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Flex alignItems="bottom">
        <SectionTitle primary fontSize="32px">
          {points.toLocaleString()}
        </SectionTitle>
        <SectionTitle fontSize="14px" fontWeight="light" ml={2} mt={2} spanFontSize="12px">
          Locked Meter points
        </SectionTitle>
      </Flex>

      <Description
        mt={4}
        title="What is a token bond ?"
        description="A bond will be redeemable against fuji tokens. The longer the vesting duration of the bond, the higher the amont of tokens redeemable."
      />

      <Flex mt={4} flexWrap="wrap">
        <Bond months="3" width={[1, 1 / 2]} onBuy={buy} />
        <BondBalance width={[1, 1 / 2]} />
        <Bond bg="#735CDD" color="white" months="6" width={[1, 1 / 2]} onBuy={buy} />
        <BondBalance bg="#735CDD" color="white" months="6" width={[1, 1 / 2]} />
        <Bond bg="#A5243D" color="white" months="12" width={[1, 1 / 2]} onBuy={buy} />
        <BondBalance bg="#A5243D" color="white" months="12" width={[1, 1 / 2]} />
      </Flex>
    </BlackBoxContainer>
  );
}

export default BondFactory;
