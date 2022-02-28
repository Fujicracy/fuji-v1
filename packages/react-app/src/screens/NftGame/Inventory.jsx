import React, { useState } from 'react';

import {
  BlackBoxContainer,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  SectionTitle,
} from 'components';

import { WrapperBuilder } from 'redstone-evm-connector';

import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_CONTRACT_IDS, INVENTORY_TYPE } from 'consts';
import { Grid } from '@material-ui/core';

import { useContractLoader, useCrateCounts, useAuth } from 'hooks';

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
  const [isRedeemed, setIsRedeemed] = useState(false);
  const contracts = useContractLoader();

  const { commonCrateAmount, epicCrateAmount, legendaryCrateAmount, totalCrateAmount } =
    useCrateCounts();

  const inventoryCards = [
    { type: INVENTORY_TYPE.COMMON, points: 1000, available: commonCrateAmount > 0 },
    { type: INVENTORY_TYPE.EPIC, points: 2500, available: epicCrateAmount > 0 },
    { type: INVENTORY_TYPE.LEGENDARY, points: 5000, available: legendaryCrateAmount > 0 },
  ];

  const availableInventories = inventoryCards.filter(inventory => inventory.available === true);
  const availableInventoryTypeCounts = availableInventories.length;

  console.log({ availableInventories });
  const onClickInventory = (type, points) => {
    setInventoryType(type);
    setInventoryPoints(points);

    setIsRedeemed(false);
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

      try {
        const wrappednftinteractions = WrapperBuilder.wrapLite(
          contracts.NFTInteractions.connect(provider.getSigner(address)),
        ).usingPriceFeed('redstone', { asset: 'ENTROPY' });

        const result = await wrappednftinteractions.openCrate(crateId, 1);

        if (result.hash) {
          setIsRedeemed(true);
        }
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
          You have <IntenseSpan primary>{totalCrateAmount} crates</IntenseSpan> to open
        </Label>
        {isMobile ? (
          <Flex position="relative" mt={3} justifyContent="center" alignItems="center" width="100%">
            {availableInventoryTypeCounts > 0 &&
              (availableInventoryTypeCounts === 1 ? (
                <InventoryItem
                  type={availableInventories[0].type}
                  onClick={() =>
                    onClickInventory(availableInventories[0].type, availableInventories[0].points)
                  }
                />
              ) : (
                <>
                  <RotateContainer left>
                    <InventoryItem
                      type={availableInventories[0].type}
                      onClick={() =>
                        onClickInventory(
                          availableInventories[0].type,
                          availableInventories[0].points,
                        )
                      }
                    />
                  </RotateContainer>
                  <RotateContainer right>
                    <InventoryItem
                      type={availableInventories[1].type}
                      onClick={() =>
                        onClickInventory(
                          availableInventories[1].type,
                          availableInventories[1].points,
                        )
                      }
                    />
                  </RotateContainer>
                  {availableInventoryTypeCounts === 3 && (
                    <RotateContainer center>
                      <InventoryItem
                        type={availableInventories[2].type}
                        onClick={() =>
                          onClickInventory(
                            availableInventories[2].type,
                            availableInventories[2].points,
                          )
                        }
                      />
                    </RotateContainer>
                  )}
                </>
              ))}
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
          isRedeemed={isRedeemed}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Inventory;
