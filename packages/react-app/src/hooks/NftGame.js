import { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { CRATE_IDS, CRATE_TYPE, NFT_GAME_POINTS_DECIMALS } from 'consts';
import { useAuth } from './Auth';
import { useContractLoader } from './ContractLoader';
import { useContractReader } from './ContractReader';

export function useProfileInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? Number(formatUnits(debtBalance, NFT_GAME_POINTS_DECIMALS)) : 0;

  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1]
    ? Number(formatUnits(userdata[1], NFT_GAME_POINTS_DECIMALS)) * 60 * 60 * 24
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

  return { points, climbingSpeedPerDay, climbingSpeedPerWeek, boost, isLoading };
}

// helpers for useCratesInfo()

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
  const intervals = probabiltyIntervals.map(i => i * 10);

  let key;
  for (let i = 0; i < intervals.length; i += 1) {
    if (i === 0) {
      key = intervals[0].toFixed(2) + '%';
    } else {
      key = (intervals[i] - intervals[i - 1]).toFixed(2) + '%';
    }

    outcomes[key] = rewards[i];
  }

  // add at the end the probabilty for a card
  if (intervals && intervals.length > 0) {
    key = (100 - intervals[intervals.length - 1]).toFixed(2) + '%';
    outcomes[key] = 'card';
  }

  return outcomes;
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
    [INVENTORY_TYPE.COMMON]: crateBalances[0],
    [INVENTORY_TYPE.EPIC]: crateBalances[1],
    [INVENTORY_TYPE.LEGENDARY]: crateBalances[2],
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
  const intervals = formatHexArray(probabiltyIntervals, NFT_GAME_POINTS_DECIMALS);
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
