import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { WrapperBuilder } from 'redstone-evm-connector';
import { formatUnits } from '@ethersproject/units';

import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { Grid } from '@material-ui/core';
import {
  BlackBoxContainer,
  InventoryItem,
  IntenseSpan,
  InventoryPopup,
  Label,
  SectionTitle,
  StackedInventoryItem,
  OutComePopup,
} from 'components';

import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  CRATE_CONTRACT_IDS,
  INVENTORY_TYPE,
  CRATE_CARD_IDS,
  NFT_GAME_POINTS_DECIMALS,
  NFT_GEARS,
} from 'consts';
import { useContractLoader, useCratesInfo, useAuth } from 'hooks';

import { giftBoxImage } from 'assets/images';

import {
  GearSetItem,
  GearSetNumber,
  GearSetContainer,
  GearSetBadge,
  HorizontalLine,
  RotateContainer,
  GridItem,
} from './styles';

const GearSet = ({ balance, name, boost }) => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <GearSetContainer>
        <GearSetItem>
          <GearSetBadge />
          <Image src={giftBoxImage} width={100} height={100} />
        </GearSetItem>
        <GearSetNumber>
          <Flex justifyContent="center" alignItems="center">
            <IntenseSpan fontSize="18px">{balance}</IntenseSpan>
          </Flex>
        </GearSetNumber>
      </GearSetContainer>
      <SectionTitle spanColor="#05FF00" mt={2}>
        {name}
        <span>+{boost}%</span>
      </SectionTitle>
    </Flex>
  );
};

function Inventory() {
  const { address, provider } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [clickedInventory, setClickedInventory] = useState({});
  const [isCratesModalOpen, setIsCratesModalOpen] = useState(false);

  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const contracts = useContractLoader();

  const { amounts: cratesAmount, prices: cratesPrices } = useCratesInfo();

  const [gearSetBalances, setGearSetBalances] = useState([]);
  const [isOutComeModalOpen, setIsOutComeModalOpen] = useState(false);
  const [outComes, setOutComes] = useState({});
  const [crateType, setCrateType] = useState({});

  const inventories = [
    {
      type: INVENTORY_TYPE.COMMON,
      amount: cratesAmount[INVENTORY_TYPE.COMMON],
      price: cratesPrices[INVENTORY_TYPE.COMMON],
    },
    {
      type: INVENTORY_TYPE.EPIC,
      amount: cratesAmount[INVENTORY_TYPE.EPIC],
      price: cratesPrices[INVENTORY_TYPE.EPIC],
    },
    {
      type: INVENTORY_TYPE.LEGENDARY,
      amount: cratesAmount[INVENTORY_TYPE.LEGENDARY],
      price: cratesPrices[INVENTORY_TYPE.LEGENDARY],
    },
  ];

  const availableInventories = inventories.filter(inventory => inventory.amount > 0);
  const availableInventoryTypeCounts = availableInventories.length;

  useEffect(() => {
    async function fetchGearSetData() {
      if (contracts && address) {
        const fetchingPromises = [];
        for (let i = CRATE_CARD_IDS.NFT_START; i <= CRATE_CARD_IDS.NFT_END; i += 1) {
          fetchingPromises.push(contracts.NFTGame.balanceOf(address, i));
        }
        const balances = await Promise.all(fetchingPromises);

        setGearSetBalances(
          balances.map((value, index) => ({
            id: CRATE_CARD_IDS.NFT_START + index,
            balance: value.toString(),
            name: NFT_GEARS[CRATE_CARD_IDS.NFT_START + index].name,
            boost: NFT_GEARS[CRATE_CARD_IDS.NFT_START + index].boost,
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
        type === INVENTORY_TYPE.COMMON
          ? CRATE_CONTRACT_IDS.COMMON
          : type === INVENTORY_TYPE.EPIC
          ? CRATE_CONTRACT_IDS.EPIC
          : CRATE_CONTRACT_IDS.LEGENDARY;

      try {
        const wrappednftinteractions = WrapperBuilder.wrapLite(
          contracts.NFTInteractions.connect(provider.getSigner(address)),
        ).usingPriceFeed('redstone', { asset: 'ENTROPY' });

        // make a rough estimate of GasLimit according the amount of crates
        const gasLimit = 130000 + amount * 12000;
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
              tokenId === CRATE_CARD_IDS.POINTS
                ? Number(formatUnits(reward.amount, NFT_GAME_POINTS_DECIMALS))
                : Number(reward.amount);

            console.log({ tokenId, rewardAmount });

            if (rewardAmount === 0) {
              tmpOutComes[CRATE_CARD_IDS.NOTHING] = tmpOutComes[CRATE_CARD_IDS.NOTHING] || {
                count: 0,
              };
              tmpOutComes[CRATE_CARD_IDS.NOTHING].count += 1;
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
              {availableInventoryTypeCounts > 0 &&
                (availableInventoryTypeCounts === 1 ? (
                  <InventoryItem
                    type={availableInventories[0].type}
                    onClick={() => onClickInventory(availableInventories[0])}
                  />
                ) : (
                  <>
                    {['left', 'right', 'center'].map(
                      (position, index) =>
                        index < availableInventories.length && (
                          <RotateContainer
                            position={position}
                            key={`mobile-inventory-${position}`}
                            onClick={() => onClickInventory(availableInventories[index])}
                          >
                            <InventoryItem
                              type={availableInventories[index].type}
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
          {gearSetBalances.length > 0 &&
            gearSetBalances.map(gearSet => (
              <Grid item xs={6} md={3} key={`gearSet-${gearSet.id}`}>
                <GearSet balance={gearSet.balance} name={gearSet.name} boost={gearSet.boost} />
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