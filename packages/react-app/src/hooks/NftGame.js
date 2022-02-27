import { formatUnits } from '@ethersproject/units';
import { CRATE_CONTRACT_IDS } from 'consts';
import { useAuth } from './Auth';
import { useContractLoader } from './ContractLoader';
import { useContractReader } from './ContractReader';

export function useProfileInfo() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? Number(formatUnits(debtBalance, 5)) : 0;

  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1] ? Number(formatUnits(userdata[1], 5)) * 60 * 60 * 24 : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  const unformattedComputeBoost = useContractReader(contracts, 'NFTInteractions', 'computeBoost', [
    address,
  ]);

  const boost = unformattedComputeBoost
    ? formatUnits(unformattedComputeBoost, 'wei') / 100
    : undefined;

  return { points, climbingSpeedPerDay, climbingSpeedPerWeek, boost };
}

export function useCrateCounts() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const unformattedCommonCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.COMMON,
  ]);
  const commonCrateAmount = unformattedCommonCrateAmount
    ? Number(formatUnits(unformattedCommonCrateAmount, 0))
    : 0;

  const unformattedEpicCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.EPIC,
  ]);
  const epicCrateAmount = unformattedEpicCrateAmount
    ? Number(formatUnits(unformattedEpicCrateAmount, 0))
    : 0;

  const unformattedLegendaryCrateAmount = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    CRATE_CONTRACT_IDS.LEGENDARY,
  ]);
  const legendaryCrateAmount = unformattedLegendaryCrateAmount
    ? Number(formatUnits(unformattedLegendaryCrateAmount, 0))
    : 0;

  const totalCrateAmount = commonCrateAmount + epicCrateAmount + legendaryCrateAmount;

  return { commonCrateAmount, epicCrateAmount, legendaryCrateAmount, totalCrateAmount };
}
