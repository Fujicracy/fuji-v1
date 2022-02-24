import React, { useState } from 'react';

import {
  BlackBoxContainer,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  SectionTitle,
} from 'components';

// import { WrapperBuilder } from 'redstone-evm-connector';

import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_CONTRACT_IDS, INVENTORY_TYPE } from 'consts';
import { Grid } from '@material-ui/core';

import { useContractLoader, useCrateCounts, useAuth } from 'hooks';

import { Transactor } from 'helpers';

import {
  GearSetItem,
  GearSetNumber,
  GearSetContainer,
  GearSetBadge,
  HorizontalLine,
  RotateContainer,
  GridItem,
} from './styles';

const GearSet = () => {
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
  const { address, provider } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [inventoryType, setInventoryType] = useState('');
  const [inventoryPoints, setInventoryPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRedeeming, setIsRedeeming] = useState(false);
  const contracts = useContractLoader();

  const { commonCrateAmount, epicCrateAmount, legendaryCrateAmount } = useCrateCounts();
  const tx = Transactor(provider);

  const onClickInventory = (type, points) => {
    setInventoryType(type);
    setInventoryPoints(points);

    setIsModalOpen(true);
  };

  const onClosePopup = () => {
    setIsModalOpen(false);
    setIsRedeeming(false);
  };

  const onRedeem = async type => {
    if (contracts) {
      setIsRedeeming(true);
      const crateId =
        type === INVENTORY_TYPE.COMMON
          ? CRATE_CONTRACT_IDS.COMMON
          : type === INVENTORY_TYPE.EPIC
          ? CRATE_CONTRACT_IDS.EPIC
          : CRATE_CONTRACT_IDS.LEGENDARY;

      console.log({ address, crateId });
      try {
        // const wrappednftinteractions = WrapperBuilder.wrapLite(
        //   contracts.NFTInteractions.connect(address),
        // ).usingPriceFeed('redstone', { asset: 'ENTROPY' });

        // console.log({ wrappednftinteractions });
        // await wrappednftinteractions.openCrate(crateId, 1);
        await tx(contracts.NFTInteractions.connect(address).openCrate(crateId, 1));
      } catch (error) {
        console.error({ error });
        setIsRedeeming(false);
      }
      setIsRedeeming(false);
    }
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
        {isMobile ? (
          <Flex position="relative" mt={3}>
            <RotateContainer left>
              <InventoryItem onClick={() => onClickInventory(INVENTORY_TYPE.COMMON, 1000)} />
            </RotateContainer>
            <RotateContainer right>
              <InventoryItem
                type={INVENTORY_TYPE.EPIC}
                onClick={() => onClickInventory(INVENTORY_TYPE.EPIC, 1000)}
              />
            </RotateContainer>
            <RotateContainer center>
              <InventoryItem
                type={INVENTORY_TYPE.LEGENDARY}
                onClick={() => onClickInventory(INVENTORY_TYPE.LEGENDARY, 1000)}
              />
            </RotateContainer>
          </Flex>
        ) : (
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            {commonCrateAmount > 0 &&
              [...Array(commonCrateAmount).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`commonCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.COMMON}
                    onClick={() => onClickInventory(INVENTORY_TYPE.COMMON, 1000)}
                  />
                </GridItem>
              ))}
            {epicCrateAmount > 0 &&
              [...Array(epicCrateAmount).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`epicCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.EPIC}
                    onClick={() => onClickInventory(INVENTORY_TYPE.EPIC, 2500)}
                  />
                </GridItem>
              ))}
            {legendaryCrateAmount > 0 &&
              [...Array(legendaryCrateAmount).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`legendaryCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.LEGENDARY}
                    onClick={() => onClickInventory(INVENTORY_TYPE.LEGENDARY, 5000)}
                  />
                </GridItem>
              ))}
          </Grid>
        )}
      </Flex>

      <Flex flexDirection="column" alignItems="flex-start" marginTop="36px">
        <Label color="white" fontSize={5} fontWeight={500}>
          Climbing gear set
        </Label>
        <HorizontalLine margin="8px 0px 24px" />
        <Grid container direction="row" alignItems="center" spacing={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
            <Grid item xs={6} md={3} key={`gearSet-${index}`}>
              <GearSet />
            </Grid>
          ))}
        </Grid>
      </Flex>
      {inventoryType && (
        <InventoryPopup
          isOpen={isModalOpen}
          onSubmit={onRedeem}
          onClose={onClosePopup}
          title={inventoryType}
          type={inventoryType}
          points={inventoryPoints}
          isLoading={isRedeeming}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Inventory;
