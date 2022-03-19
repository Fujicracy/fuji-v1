import { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { CRATE_CONTRACT_IDS, INVENTORY_TYPE, NFT_GAME_POINTS_DECIMALS } from 'consts';
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

export function useCratesInfo() {
  const { address } = useAuth();
  const contracts = useContractLoader();

  // common crate info
  const unformattedCommonCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.COMMON,
  ]);
  const commonCrateAmount = unformattedCommonCrateAmount
    ? Number(formatUnits(unformattedCommonCrateAmount, 0))
    : 0;
  const unformattedCommonCratePrice = useContractReader(
    contracts,
    'NFTInteractions',
    'cratePrices',
    [CRATE_CONTRACT_IDS.COMMON],
  );
  const commonCratePrice = unformattedCommonCratePrice
    ? Number(formatUnits(unformattedCommonCratePrice, NFT_GAME_POINTS_DECIMALS))
    : 0;

  // epic crate info
  const unformattedEpicCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.EPIC,
  ]);
  const epicCrateAmount = unformattedEpicCrateAmount
    ? Number(formatUnits(unformattedEpicCrateAmount, 0))
    : 0;
  const unformattedEpicCratePrice = useContractReader(contracts, 'NFTInteractions', 'cratePrices', [
    CRATE_CONTRACT_IDS.EPIC,
  ]);
  const epicCratePrice = unformattedEpicCratePrice
    ? Number(formatUnits(unformattedEpicCratePrice, NFT_GAME_POINTS_DECIMALS))
    : 0;

  // legendary crate info
  const unformattedLegendaryCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.LEGENDARY,
  ]);
  const legendaryCrateAmount = unformattedLegendaryCrateAmount
    ? Number(formatUnits(unformattedLegendaryCrateAmount, 0))
    : 0;
  const unformattedLegendaryCratePrice = useContractReader(
    contracts,
    'NFTInteractions',
    'cratePrices',
    [CRATE_CONTRACT_IDS.LEGENDARY],
  );
  const legendaryCratePrice = unformattedLegendaryCratePrice
    ? Number(formatUnits(unformattedLegendaryCratePrice, NFT_GAME_POINTS_DECIMALS))
    : 0;

  const totalCrateAmount = commonCrateAmount + epicCrateAmount + legendaryCrateAmount;

  return {
    amounts: {
      [INVENTORY_TYPE.COMMON]: commonCrateAmount,
      [INVENTORY_TYPE.EPIC]: epicCrateAmount,
      [INVENTORY_TYPE.LEGENDARY]: legendaryCrateAmount,
      total: totalCrateAmount,
    },
    prices: {
      [INVENTORY_TYPE.COMMON]: commonCratePrice,
      [INVENTORY_TYPE.EPIC]: epicCratePrice,
      [INVENTORY_TYPE.LEGENDARY]: legendaryCratePrice,
    },
  };
}
