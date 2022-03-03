import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

import { useContractLoader, useCratesInfo, useAuth } from 'hooks';

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

  const { amounts: cratesAmount, prices: cratesPrices } = useCratesInfo();

  const inventoryCards = [
    {
      type: INVENTORY_TYPE.COMMON,
      points: cratesPrices[INVENTORY_TYPE.COMMON],
      available: cratesAmount[INVENTORY_TYPE.COMMON] > 0,
    },
    {
      type: INVENTORY_TYPE.EPIC,
      points: cratesPrices[INVENTORY_TYPE.EPIC],
      available: cratesAmount[INVENTORY_TYPE.EPIC] > 0,
    },
    {
      type: INVENTORY_TYPE.LEGENDARY,
      points: cratesPrices[INVENTORY_TYPE.LEGENDARY],
      available: cratesAmount[INVENTORY_TYPE.LEGENDARY] > 0,
    },
  ];

  const availableInventories = inventoryCards.filter(inventory => inventory.available === true);
  const availableInventoryTypeCounts = availableInventories.length;

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
      mb="88px"
    >
      <Flex flexDirection="column" alignItems="flex-start">
        <Label color="white" fontSize="24px" marginBottom="24px">
          You have <IntenseSpan primary>{cratesAmount.total} crates</IntenseSpan> to open
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
            {cratesAmount[INVENTORY_TYPE.COMMON] > 0 &&
              [...Array(cratesAmount[INVENTORY_TYPE.COMMON]).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`commonCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.COMMON}
                    onClick={() =>
                      onClickInventory(INVENTORY_TYPE.COMMON, cratesPrices[INVENTORY_TYPE.COMMON])
                    }
                  />
                </GridItem>
              ))}
            {cratesAmount[INVENTORY_TYPE.EPIC] > 0 &&
              [...Array(cratesAmount[INVENTORY_TYPE.EPIC]).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`epicCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.EPIC}
                    onClick={() =>
                      onClickInventory(INVENTORY_TYPE.EPIC, cratesPrices[INVENTORY_TYPE.EPIC])
                    }
                  />
                </GridItem>
              ))}
            {cratesAmount[INVENTORY_TYPE.LEGENDARY] > 0 &&
              [...Array(cratesAmount[INVENTORY_TYPE.LEGENDARY]).keys()].map(index => (
                <GridItem item xs={6} md={3} key={`legendaryCrate-${index}`}>
                  <InventoryItem
                    type={INVENTORY_TYPE.LEGENDARY}
                    onClick={() =>
                      onClickInventory(
                        INVENTORY_TYPE.LEGENDARY,
                        cratesPrices[INVENTORY_TYPE.LEGENDARY],
                      )
                    }
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
        <Label
          color="white"
          fontSize="14px"
          fontWeight={500}
          mt="8px"
          textAlign="left"
          lineHeight="20px"
        >
          Gear can be minted when opening crates. {isMobile && <br />}To buy crates please go to the{' '}
          <NavLink to="/nft-game/store">
            <IntenseSpan primary underline>
              store
            </IntenseSpan>
          </NavLink>
        </Label>

        <HorizontalLine margin="16px 0px 24px" />
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
