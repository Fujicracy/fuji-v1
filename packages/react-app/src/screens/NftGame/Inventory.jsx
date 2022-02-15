/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import {
  BlackBoxContainer,
  Description,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  SectionTitle,
} from 'components';

import { Flex, Image } from 'rebass';
import { nftGameStoreDecorationImage, commonMask } from 'assets/images';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { Grid } from '@material-ui/core';
import {
  StoreDecoration,
  TiledPanel,
  GearSetItem,
  GearSetNumber,
  GearSetContainer,
  GearSetBadge,
  HorizontalLine,
} from './styles';

const GearSet = ({ tileText, backgroundColor }) => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <GearSetContainer>
        <GearSetItem>
          <GearSetBadge />
          <SectionTitle>item image</SectionTitle>
        </GearSetItem>
        <GearSetNumber>
          <Flex justifyContent="center" alignItems="center">
            <IntenseSpan fontSize="18px">3</IntenseSpan>
          </Flex>
        </GearSetNumber>
      </GearSetContainer>
      <SectionTitle spanColor="#05FF00" mt={2}>
        Heat Capsule<span>+5%</span>
      </SectionTitle>
    </Flex>
  );
};
function Inventory() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [inventoryType, setInventoryType] = useState('');
  const [inventoryPoints, setInventoryPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryTitle, setInventoryTitle] = useState('');

  const onClickInventory = (type, points) => {
    setInventoryType(type);
    setInventoryPoints(points);

    setInventoryTitle(type);
    setIsModalOpen(true);
  };
  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
    >
      <Flex flexDirection="column" alignItems="flex-start">
        <Label color="white" fontSize="24px" marginBottom="24px">
          You have <IntenseSpan primary>3 crates</IntenseSpan> to open
        </Label>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6} md={3}>
            <InventoryItem
              type={INVENTORY_TYPE.COMMON}
              title={INVENTORY_TYPE.COMMON}
              points={1000}
              description="Energy points"
              onClick={() => onClickInventory(INVENTORY_TYPE.COMMON, 1000)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <InventoryItem
              type={INVENTORY_TYPE.COMMON}
              title={INVENTORY_TYPE.COMMON}
              points={1000}
              description="Energy points"
              onClick={() => onClickInventory(INVENTORY_TYPE.COMMON, 1000)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <InventoryItem
              type={INVENTORY_TYPE.EPIC}
              title={INVENTORY_TYPE.EPIC}
              points={2500}
              description="Energy points"
              onClick={() => onClickInventory(INVENTORY_TYPE.EPIC, 1000)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <InventoryItem
              type={INVENTORY_TYPE.EPIC}
              title={INVENTORY_TYPE.EPIC}
              points={2500}
              description="Energy points"
              onClick={() => onClickInventory(INVENTORY_TYPE.EPIC, 1000)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <InventoryItem
              type={INVENTORY_TYPE.LEGENDARY}
              title={INVENTORY_TYPE.LEGENDARY}
              points={2500}
              description="Energy points"
              onClick={() => onClickInventory(INVENTORY_TYPE.LEGENDARY, 1000)}
            />
          </Grid>
        </Grid>
      </Flex>

      <Flex flexDirection="column" alignItems="flex-start" marginTop="36px">
        <Label color="white" fontSize={5}>
          Climbing gear set
        </Label>
        <HorizontalLine />
        <Grid container direction="row" alignItems="center" spacing={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
            <Grid item xs={6} md={3}>
              <GearSet />
            </Grid>
          ))}
        </Grid>
      </Flex>
      {inventoryType && (
        <InventoryPopup
          isOpen={isModalOpen}
          onSubmit={() => console.log('clicked')}
          onClose={() => setIsModalOpen(false)}
          title={inventoryTitle}
          type={inventoryType}
          points={inventoryPoints}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Inventory;
