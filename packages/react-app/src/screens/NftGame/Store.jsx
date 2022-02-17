import React from 'react';

import {
  BlackBoxContainer,
  Description,
  GeneralItem,
  SectionTitle,
  LegendaryItem,
} from 'components';

import { Flex } from 'rebass';
import { nftGameStoreDecorationImage } from 'assets/images';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { Grid } from '@material-ui/core';

import { usePoints } from 'hooks';
import { StoreDecoration } from './styles';

function Store() {
  const points = usePoints();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <BlackBoxContainer
      maxWidth="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
    >
      <Flex justifyContent="space-between">
        <Flex flexDirection="column">
          <Flex alignItems="bottom">
            <SectionTitle primary fontSize="32px">
              {points.toLocaleString('en-US')}
            </SectionTitle>
            <SectionTitle fontWeight="light" ml={2} mt={2}>
              Energy points
            </SectionTitle>
          </Flex>

          <SectionTitle
            mt={2}
            fontWeight="500"
            lineHeight="24px"
            fontSize={isMobile ? '12px' : '16px'}
          >
            Burn energy points and buy a crate.
            <br /> When you open a crate you can get nothing, free points or booster cardss
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
      <Flex mt={isMobile ? '32px' : '40px'}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={INVENTORY_TYPE.COMMON}
              title={INVENTORY_TYPE.COMMON}
              points={1000}
              description="Energy points"
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <GeneralItem
              type={INVENTORY_TYPE.EPIC}
              title={INVENTORY_TYPE.EPIC}
              points={2500}
              description="Energy points"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LegendaryItem points={2500} description="Energy points" />
          </Grid>
        </Grid>
      </Flex>
    </BlackBoxContainer>
  );
}

export default Store;
