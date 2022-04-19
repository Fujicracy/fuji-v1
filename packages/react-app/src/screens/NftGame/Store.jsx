import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
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
import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_IDS, CRATE_TYPE } from 'consts';
import { Grid } from '@material-ui/core';

import { useProfileInfo, useContractLoader, useAuth, useCratesInfo } from 'hooks';
import { Transactor } from 'helpers';
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
    description: `You don't have enough meter points to make this purchase.`,
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
  const props = useSpring({
    points,
    config: config.gentle,
  });

  const tx = Transactor(provider);

  const history = useHistory();

  const mintInventory = async (type, amount) => {
    if (amount <= 0) return false;
    setActionResult(ACTION_RESULT.NONE);

    const crateId =
      type === CRATE_TYPE.COMMON
        ? CRATE_IDS.COMMON
        : type === CRATE_TYPE.EPIC
        ? CRATE_IDS.EPIC
        : CRATE_IDS.LEGENDARY;

    if (cratesPrices[type] * amount > points) {
      setActionResult(ACTION_RESULT.NOT_ENOUGH_POINTS);
      return false;
    }

    try {
      const res = await tx(contracts.NFTInteractions.mintCrates(crateId, amount));

      if (res && res.hash) {
        const receipt = await res.wait();
        if (receipt) {
          setActionResult(ACTION_RESULT.SUCCESS);
          return true;
        }
      }
    } catch (error) {
      setActionResult(ACTION_RESULT.ERROR);
      console.error('minting inventory error:', { error });
    }
    setActionResult(ACTION_RESULT.ERROR);
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
              <animated.div>
                {props.points.interpolate(p => parseFloat(p).toLocaleString())}
              </animated.div>
            </SectionTitle>
            <SectionTitle fontSize="14px" fontWeight="light" ml={2} mt={2} spanFontSize="12px">
              Meter points
            </SectionTitle>
          </Flex>

          <SectionTitle
            mt={2}
            fontWeight="500"
            lineHeight="24px"
            fontSize={isMobile ? '12px' : '16px'}
          >
            Climb Mt. Fuji by accumulating meter points and use them to buy crates.
          </SectionTitle>
        </Flex>
        <StoreDecoration src={nftGameStoreDecorationImage} alt="flask" />
      </Flex>
      {!isMobile && (
        <Description
          mt={4}
          title="How to earn Meter points"
          description="Users with open positions accumulate meter points proportional to the borrowed amount. For 1$ of debt in each vault 1p/day gets earned. For example, a user having two open positions: 1,500 debt of DAI and 500 debt of USDC accumulates 2,000 meter points every day. Points are not transferable. "
        />
      )}
      <Flex mt={isMobile ? '20px' : '40px'}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={CRATE_TYPE.COMMON}
              title={CRATE_TYPE.COMMON}
              price={cratesPrices[CRATE_TYPE.COMMON]}
              description="Meter points"
              onBuy={mintInventory}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={CRATE_TYPE.EPIC}
              title={CRATE_TYPE.EPIC}
              price={cratesPrices[CRATE_TYPE.EPIC]}
              description="Meter points"
              onBuy={mintInventory}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LegendaryItem
              price={cratesPrices[CRATE_TYPE.LEGENDARY]}
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
