import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
  BlackBoxContainer,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  SectionTitle,
  StackedInventoryItem,
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
  const [clickedInventoryType, setClickedInventoryType] = useState('');
  const [clickedInventoryPoints, setClickedInventoryPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const contracts = useContractLoader();

  const { amounts: cratesAmount, prices: cratesPrices } = useCratesInfo();

  const inventories = [
    {
      type: INVENTORY_TYPE.COMMON,
      points: cratesPrices[INVENTORY_TYPE.COMMON],
      amount: cratesAmount[INVENTORY_TYPE.COMMON],
    },
    {
      type: INVENTORY_TYPE.EPIC,
      points: cratesPrices[INVENTORY_TYPE.EPIC],
      amount: cratesAmount[INVENTORY_TYPE.EPIC],
    },
    {
      type: INVENTORY_TYPE.LEGENDARY,
      points: cratesPrices[INVENTORY_TYPE.LEGENDARY],
      amount: cratesAmount[INVENTORY_TYPE.LEGENDARY],
    },
  ];

  const availableInventories = inventories.filter(inventory => inventory.amount > 0);
  const availableInventoryTypeCounts = availableInventories.length;

  const onClickInventory = (type, points) => {
    setClickedInventoryType(type);
    setClickedInventoryPoints(points);

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

        console.log({ result });
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
      {cratesAmount.total > 0 && (
        <Flex flexDirection="column" alignItems="flex-start" marginBottom="36px">
          <Label color="white" fontSize="24px" marginBottom="24px">
            You have <IntenseSpan primary>{cratesAmount.total} crates</IntenseSpan> to open
          </Label>

          {isMobile ? (
            <Flex
              position="relative"
              mt={3}
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
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
                    {['left', 'right', 'center'].map(
                      (position, index) =>
                        index < availableInventories.length && (
                          <RotateContainer position={position} key={`mobile-inventory-${position}`}>
                            <InventoryItem
                              type={availableInventories[index].type}
                              onClick={() =>
                                onClickInventory(
                                  availableInventories[index].type,
                                  availableInventories[index].points,
                                )
                              }
                              amount={availableInventories[index].amount}
                              badgePosition={position}
                            />
                          </RotateContainer>
                        ),
                    )}
                  </>
                ))}
            </Flex>
          ) : (
            <Grid container alignItems="center" justifyContent="center" spacing={2}>
              {availableInventories.map(inventory => (
                <GridItem item xs={6} md={4} key={`desktop-inventory-${inventory.type}`}>
                  <StackedInventoryItem
                    type={inventory.type}
                    onClick={() => onClickInventory(inventory.type, inventory.points)}
                    amount={inventory.amount}
                  />
                </GridItem>
              ))}
            </Grid>
          )}
        </Flex>
      )}

      <Flex flexDirection="column" alignItems="flex-start">
        <Label color="white" fontSize={5} fontWeight={500}>
          Climbing gear set
        </Label>

        {cratesAmount.total === 0 && (
          <Label
            color="white"
            fontSize="14px"
            fontWeight={500}
            mt="8px"
            textAlign="left"
            lineHeight="20px"
          >
            Gear can be minted when opening crates. {isMobile && <br />}To buy crates please go to
            the{' '}
            <NavLink to="/nft-game/store">
              <IntenseSpan primary underline>
                store
              </IntenseSpan>
            </NavLink>
          </Label>
        )}

        <HorizontalLine margin="16px 0px 24px" />
        <Grid container direction="row" alignItems="center" spacing={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
            <Grid item xs={6} md={3} key={`gearSet-${index}`}>
              <GearSet />
            </Grid>
          ))}
        </Grid>
      </Flex>
      {clickedInventoryType && (
        <InventoryPopup
          isOpen={isModalOpen}
          onSubmit={onRedeem}
          onClose={onClosePopup}
          title={clickedInventoryType}
          type={clickedInventoryType}
          points={clickedInventoryPoints}
          isLoading={isRedeeming}
          isRedeemed={isRedeemed}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Inventory;
