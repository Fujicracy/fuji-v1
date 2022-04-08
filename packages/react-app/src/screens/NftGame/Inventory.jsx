import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { WrapperBuilder } from 'redstone-evm-connector';
import { formatUnits } from '@ethersproject/units';

import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid } from '@material-ui/core';
import {
  BlackBoxContainer,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  StackedInventoryItem,
  OutComePopup,
} from 'components';

import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  NFT_IDS,
  CRATE_IDS,
  CRATE_TYPE,
  GEAR_IDS,
  NFT_GAME_POINTS_DECIMALS,
  NFT_ITEMS,
} from 'consts';
import { useContractLoader, useCratesInfo, useAuth } from 'hooks';

import { HorizontalLine, RotateContainer, GridItem } from './styles';
import GearSet from '../../components/GearSet';

function Inventory() {
  const { address, provider } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [clickedInventory, setClickedInventory] = useState({});
  const [isCratesModalOpen, setIsCratesModalOpen] = useState(false);

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const contracts = useContractLoader();

  const { amounts: cratesAmount, prices: cratesPrices } = useCratesInfo();

  const [nftGears, setNftGears] = useState([]);
  const [isOutComeModalOpen, setIsOutComeModalOpen] = useState(false);
  const [outComes, setOutComes] = useState({});
  const [crateType, setCrateType] = useState({});

  const crates = [
    {
      type: CRATE_TYPE.COMMON,
      amount: cratesAmount[CRATE_TYPE.COMMON],
      price: cratesPrices[CRATE_TYPE.COMMON],
    },
    {
      type: CRATE_TYPE.EPIC,
      amount: cratesAmount[CRATE_TYPE.EPIC],
      price: cratesPrices[CRATE_TYPE.EPIC],
    },
    {
      type: CRATE_TYPE.LEGENDARY,
      amount: cratesAmount[CRATE_TYPE.LEGENDARY],
      price: cratesPrices[CRATE_TYPE.LEGENDARY],
    },
  ];

  const availableCrates = crates.filter(inventory => inventory.amount > 0);
  const availableCratesCount = availableCrates.length;

  useEffect(() => {
    async function fetchGearSetData() {
      if (contracts && address) {
        const params = [[], []];
        for (let i = GEAR_IDS.START; i <= GEAR_IDS.END; i += 1) {
          params[0].push(address);
          params[1].push(i);
        }
        const balances = await contracts.NFTGame.balanceOfBatch(...params);

        setNftGears(
          balances.map((value, index) => ({
            id: GEAR_IDS.START + index,
            balance: value.toString(),
            name: NFT_ITEMS[GEAR_IDS.START + index].name,
            boost: NFT_ITEMS[GEAR_IDS.START + index].boost,
            images: NFT_ITEMS[GEAR_IDS.START + index].images,
          })),
        );
      }
    }
    fetchGearSetData();
  }, [contracts, address]);

  const onClickInventory = inventory => {
    setClickedInventory(inventory);

    setIsRedeemed(false);
    setIsCratesModalOpen(true);
  };

  const onCloseCrateModal = () => {
    setIsCratesModalOpen(false);
    setIsRedeeming(false);
  };

  const onCloseOutComeModal = () => {
    setIsOutComeModalOpen(false);
  };

  const onRedeem = async (type, amount) => {
    if (contracts) {
      setIsRedeeming(true);
      setCrateType(type);
      const crateId =
        type === CRATE_TYPE.COMMON
          ? CRATE_IDS.COMMON
          : type === CRATE_TYPE.EPIC
          ? CRATE_IDS.EPIC
          : CRATE_IDS.LEGENDARY;

      try {
        const wrappednftinteractions = WrapperBuilder.wrapLite(
          contracts.NFTInteractions.connect(provider.getSigner(address)),
        ).usingPriceFeed('redstone', { asset: 'ENTROPY' });

        // make a rough estimate of GasLimit according the amount of crates
        const gasLimit = 180000 + amount * 12000;
        const result = await wrappednftinteractions.openCrate(crateId, amount, { gasLimit });

        if (result && result.hash) {
          const receipt = await result.wait();
          const iface = contracts.NFTInteractions.interface;
          const parsedLog = iface.parseLog(receipt.logs[receipt.logs.length - 1]);
          const { rewards } = parsedLog.args || [];

          console.log({ rewards });

          const tmpOutComes = {};
          rewards.forEach(reward => {
            const tokenId = Number(reward.tokenId);
            const rewardAmount =
              tokenId === NFT_IDS.POINTS
                ? Number(formatUnits(reward.amount, NFT_GAME_POINTS_DECIMALS))
                : Number(reward.amount);

            console.log({ tokenId, rewardAmount });

            if (rewardAmount === 0) {
              tmpOutComes[NFT_IDS.NOTHING] = tmpOutComes[NFT_IDS.NOTHING] || {
                count: 0,
              };
              tmpOutComes[NFT_IDS.NOTHING].count += 1;
            } else {
              tmpOutComes[reward.tokenId] = tmpOutComes[reward.tokenId] || { count: 0, amount: 0 };
              tmpOutComes[reward.tokenId].count += 1;
              tmpOutComes[reward.tokenId].amount += rewardAmount;
            }
          });
          setOutComes(tmpOutComes);

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
              {availableCratesCount > 0 &&
                (availableCratesCount === 1 ? (
                  <InventoryItem
                    type={availableCrates[0].type}
                    onClick={() => onClickInventory(availableCrates[0])}
                  />
                ) : (
                  <>
                    {['left', 'right', 'center'].map(
                      (position, index) =>
                        index < availableCrates.length && (
                          <RotateContainer
                            position={position}
                            key={`mobile-inventory-${position}`}
                            onClick={() => onClickInventory(availableCrates[index])}
                          >
                            <InventoryItem
                              type={availableCrates[index].type}
                              amount={availableCrates[index].amount}
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
              {availableCrates.map(inventory => (
                <GridItem item xs={6} md={4} key={`desktop-inventory-${inventory.type}`}>
                  <StackedInventoryItem
                    type={inventory.type}
                    onClick={() => onClickInventory(inventory)}
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
          {nftGears.length > 0 &&
            nftGears.map(nftGear => (
              <Grid item xs={6} md={4} key={`gearSet-${nftGear.id}`}>
                <GearSet nftGear={nftGear} />
              </Grid>
            ))}
        </Grid>
      </Flex>
      {clickedInventory.type && isCratesModalOpen && (
        <InventoryPopup
          isOpen={isCratesModalOpen}
          onSubmit={onRedeem}
          onClose={onCloseCrateModal}
          inventory={clickedInventory}
          isLoading={isRedeeming}
          isRedeemed={isRedeemed}
          onEndOpeningAnimation={() => {
            setIsCratesModalOpen(false);
            setIsOutComeModalOpen(true);
          }}
        />
      )}

      {isOutComeModalOpen && (
        <OutComePopup
          isOpen
          crateType={crateType}
          outComes={outComes}
          onClose={onCloseOutComeModal}
        />
      )}
    </BlackBoxContainer>
  );
}

export default Inventory;
