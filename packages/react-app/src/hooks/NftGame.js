import { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { CRATE_IDS, CRATE_TYPE, NFT_GAME_POINTS_DECIMALS, GEAR_IDS, NFT_ITEMS } from 'consts';
import { useAuth } from './Auth';
import { useContractLoader } from './ContractLoader';
import { useContractReader } from './ContractReader';

// helpers

function formatHexArray(values, decimals = 0) {
  if (!values) return [];
  return values.map(v => (v ? Number(formatUnits(v, decimals)) : 0));
}

function formatHexArrayArray(values, decimals = 0) {
  if (!values) return [];
  return values.map(v => (v ? formatHexArray(v, decimals) : []));
}

// reference:
// https://discord.com/channels/808620015653879828/938043588951048202/955506490788163605
function getRewardOutcomes(probabiltyIntervals, rewards) {
  const outcomes = {};

  // transform to make easier percentage calculations
  const intervals = probabiltyIntervals.map(i => i * 100);

  let prob;
  for (let i = 0; i < rewards.length; i += 1) {
    if (i === 0) {
      prob = intervals[0].toFixed(2) + '%';
    } else {
      prob = (intervals[i] - intervals[i - 1]).toFixed(2) + '%';
    }

    outcomes[rewards[i]] = prob;
  }

  // add at the end the probabilty for a card
  if (intervals && intervals.length > 0) {
    prob = (100 - intervals[intervals.length - 1]).toFixed(2) + '%';
    outcomes.card = prob;
  }

  return outcomes;
}

export function useGearsBalance() {
  const contracts = useContractLoader();
  const { address } = useAuth();

  const params = [[], []];
  for (let i = GEAR_IDS.START; i <= GEAR_IDS.END; i += 1) {
    params[0].push(address);
    params[1].push(i);
  }

  // TODO: Shall we use deconstruction for all props ?
  const defaultParams = params[0].map((_, index) => ({
    id: GEAR_IDS.START + index,
    balance: 0,
    name: NFT_ITEMS[GEAR_IDS.START + index].name,
    description: NFT_ITEMS[GEAR_IDS.START + index].description,
    boost: NFT_ITEMS[GEAR_IDS.START + index].boost,
    images: NFT_ITEMS[GEAR_IDS.START + index].images,
  }));

  const [gears, setGears] = useState(defaultParams);
  const [total, setTotal] = useState(0);

  const unformattedBalances = useContractReader(contracts, 'NFTGame', 'balanceOfBatch', params);
  const gearBalances = formatHexArray(unformattedBalances, 0);
  const count = gearBalances.reduce((prev, v) => prev + v, 0);

  useEffect(() => {
    if (count !== total) {
      setTotal(count);
      setGears(
        gearBalances.map((value, index) => ({
          id: GEAR_IDS.START + index,
          balance: value.toString(),
          name: NFT_ITEMS[GEAR_IDS.START + index].name,
          description: NFT_ITEMS[GEAR_IDS.START + index].description,
          boost: NFT_ITEMS[GEAR_IDS.START + index].boost,
          images: NFT_ITEMS[GEAR_IDS.START + index].images,
        })),
      );
    }
  }, [count, total, gearBalances]);

  return { gears, total };
}

export function useCratesBalance() {
  const contracts = useContractLoader();
  const { address } = useAuth();
  const unformattedBalances = useContractReader(contracts, 'NFTGame', 'balanceOfBatch', [
    [address, address, address],
    [CRATE_IDS.COMMON, CRATE_IDS.EPIC, CRATE_IDS.LEGENDARY],
  ]);
  const crateBalances = formatHexArray(unformattedBalances, 0);

  return {
    [CRATE_TYPE.COMMON]: crateBalances[0],
    [CRATE_TYPE.EPIC]: crateBalances[1],
    [CRATE_TYPE.LEGENDARY]: crateBalances[2],
    total: crateBalances.reduce((prev, v) => prev + v, 0),
  };
}

export function useCratesInfo() {
  const contracts = useContractLoader();
  const crateBalances = useCratesBalance();

  // crates prices
  const commonPrice = useContractReader(contracts, 'NFTInteractions', 'cratePrices', [
    CRATE_IDS.COMMON,
  ]);
  const epicPrice = useContractReader(contracts, 'NFTInteractions', 'cratePrices', [
    CRATE_IDS.EPIC,
  ]);
  const legendaryPrice = useContractReader(contracts, 'NFTInteractions', 'cratePrices', [
    CRATE_IDS.LEGENDARY,
  ]);
  const cratePrices = formatHexArray(
    [commonPrice, epicPrice, legendaryPrice],
    NFT_GAME_POINTS_DECIMALS,
  );

  // crates probabilty outcomes
  const probabiltyIntervals = useContractReader(
    contracts,
    'NFTInteractions',
    'getProbabilityIntervals',
    [],
  );
  // use 6 because the probabilty intervals are based on 1000000 (6 zeros)
  const intervals = formatHexArray(probabiltyIntervals, 6);
  const commonRewards = useContractReader(contracts, 'NFTInteractions', 'getCrateRewards', [
    CRATE_IDS.COMMON,
  ]);
  const epicRewards = useContractReader(contracts, 'NFTInteractions', 'getCrateRewards', [
    CRATE_IDS.EPIC,
  ]);
  const legendaryRewards = useContractReader(contracts, 'NFTInteractions', 'getCrateRewards', [
    CRATE_IDS.LEGENDARY,
  ]);
  const crateRewards = formatHexArrayArray(
    [commonRewards, epicRewards, legendaryRewards],
    NFT_GAME_POINTS_DECIMALS,
  );

  return {
    amounts: crateBalances,
    prices: {
      [CRATE_TYPE.COMMON]: cratePrices[0],
      [CRATE_TYPE.EPIC]: cratePrices[1],
      [CRATE_TYPE.LEGENDARY]: cratePrices[2],
    },
    outcomes: {
      [CRATE_TYPE.COMMON]: getRewardOutcomes(intervals, crateRewards[0]),
      [CRATE_TYPE.EPIC]: getRewardOutcomes(intervals, crateRewards[1]),
      [CRATE_TYPE.LEGENDARY]: getRewardOutcomes(intervals, crateRewards[2]),
    },
  };
}

export function useProfileInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? Number(formatUnits(debtBalance, NFT_GAME_POINTS_DECIMALS)) : 0;

  const claimedPoints = useContractReader(contracts, 'NFTGame', 'isClaimed', [address], 0);
  const rateOfAccrual = useContractReader(contracts, 'NFTGame', 'computeRateOfAccrual', [address]);
  const climbingSpeedPerDay = rateOfAccrual
    ? Number(formatUnits(rateOfAccrual, NFT_GAME_POINTS_DECIMALS)) * 60 * 60 * 24
    : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  const unformattedComputeBoost = useContractReader(contracts, 'NFTInteractions', 'computeBoost', [
    address,
  ]);

  const boost = unformattedComputeBoost
    ? formatUnits(unformattedComputeBoost, 'wei') / 100
    : undefined;

  useEffect(() => {
    if (points >= 0 && climbingSpeedPerWeek >= 0 && boost >= 0) setIsLoading(false);
  }, [points, climbingSpeedPerWeek, boost]);

  return { points, claimedPoints, climbingSpeedPerDay, climbingSpeedPerWeek, boost, isLoading };
}
