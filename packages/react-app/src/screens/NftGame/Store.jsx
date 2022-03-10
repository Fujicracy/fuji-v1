import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  BlackBoxContainer,
  Description,
  GeneralItem,
  SectionTitle,
  LegendaryItem,
  ResultPopup,
} from 'components';

import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_CONTRACT_IDS, INVENTORY_TYPE } from 'consts';
import { Grid } from '@material-ui/core';

import { useProfileInfo, useContractLoader, useAuth, useCratesInfo } from 'hooks';
import { Transactor, intToString } from 'helpers';
import { nftGameStoreDecorationImage, happyIcon } from 'assets/images';
import { StoreDecoration } from './styles';

const ACTION_RESULT = {
  NONE: 'none',
  SUCCESS: 'success',
  ERROR: 'error',
  NOT_ENOUGH_POINTS: 'not-enough',
};

const ACTION_DESCRIPTIONS = {
  [ACTION_RESULT.SUCCESS]: {
    value: ACTION_RESULT.SUCCESS,
    title: 'Congratulation!',
    description:
      'Your action have been processed by Fuji, you can now check your crates into your inventory.',
    submitText: 'Inventory',
    emotionIcon: happyIcon,
  },
  [ACTION_RESULT.ERROR]: {
    value: ACTION_RESULT.ERROR,
    title: 'Something is wrong',
    description:
      'An error occured during the transaction, it can be your credits number or a problem on our side.',
    submitText: 'Try again',
    emotionIcon: '',
  },
  [ACTION_RESULT.NOT_ENOUGH_POINTS]: {
    value: ACTION_RESULT.NOT_ENOUGH_POINTS,
    title: 'Not enough points',
    description: `You don't have enough points to buy.`,
    submitText: 'Back',
    emotionIcon: '',
  },
};

function Store() {
  const [actionResult, setActionResult] = useState(ACTION_RESULT.NONE);
  const { points, isLoading } = useProfileInfo();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const contracts = useContractLoader();

  const { provider } = useAuth();
  const { prices: cratesPrices } = useCratesInfo();

  const tx = Transactor(provider);

  const history = useHistory();

  const mintInventory = async (type, amount) => {
    if (amount <= 0) return false;
    setActionResult(ACTION_RESULT.NONE);

    const crateId =
      type === INVENTORY_TYPE.COMMON
        ? CRATE_CONTRACT_IDS.COMMON
        : type === INVENTORY_TYPE.EPIC
        ? CRATE_CONTRACT_IDS.EPIC
        : CRATE_CONTRACT_IDS.LEGENDARY;

    if (cratesPrices[type] * amount > points) {
      setActionResult(ACTION_RESULT.NOT_ENOUGH_POINTS);
      return false;
    }

    try {
      const txResult = await tx(contracts.NFTInteractions.mintCrates(crateId, amount));
      const res = txResult && !!txResult?.hash;
      setActionResult(res ? ACTION_RESULT.SUCCESS : ACTION_RESULT.ERROR);
      return res;
    } catch (error) {
      setActionResult(ACTION_RESULT.ERROR);
      console.error('minting inventory error:', { error });
    }

    return false;
  };

  const handleCloseModal = () => {
    setActionResult(ACTION_RESULT.NONE);
  };

  const handleSubmitModal = result => {
    setActionResult(ACTION_RESULT.NONE);
    if (result === ACTION_RESULT.SUCCESS) history.push('/nft-game/inventory');
  };

  return (
    <BlackBoxContainer
      maxWidth="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Flex justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex alignItems="bottom">
            <SectionTitle primary fontSize="32px">
              {intToString(points)}
            </SectionTitle>
            <SectionTitle fontSize="14px" fontWeight="light" ml={2} mt={2} spanFontSize="12px">
              Meter points <span>(?)</span>
            </SectionTitle>
          </Flex>

          <SectionTitle
            mt={2}
            fontWeight="500"
            lineHeight="24px"
            fontSize={isMobile ? '12px' : '16px'}
          >
            Burn energy points and buy a crate.
            <br /> When you open a crate you can get nothing, free points or booster cards
          </SectionTitle>
        </Flex>
        <StoreDecoration src={nftGameStoreDecorationImage} alt="flask" />
      </Flex>
      {!isMobile && (
        <Description
          mt={4}
          title="How to earn Energy points"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
        />
      )}
      <Flex mt={isMobile ? '20px' : '40px'}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={INVENTORY_TYPE.COMMON}
              title={INVENTORY_TYPE.COMMON}
              points={cratesPrices[INVENTORY_TYPE.COMMON]}
              description="Meter points"
              onBuy={mintInventory}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={INVENTORY_TYPE.EPIC}
              title={INVENTORY_TYPE.EPIC}
              points={cratesPrices[INVENTORY_TYPE.EPIC]}
              description="Meter points"
              onBuy={mintInventory}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LegendaryItem
              points={cratesPrices[INVENTORY_TYPE.LEGENDARY]}
              description="Meter points"
              onBuy={mintInventory}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Flex>
      {actionResult !== ACTION_RESULT.NONE && (
        <ResultPopup
          isOpen
          content={ACTION_DESCRIPTIONS[actionResult]}
          onSubmit={handleSubmitModal}
          onClose={handleCloseModal}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Store;
