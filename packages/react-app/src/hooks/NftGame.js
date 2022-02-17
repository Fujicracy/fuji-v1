import { formatUnits } from '@ethersproject/units';
import { useAuth } from './Auth';
import { useContractLoader } from './ContractLoader';
import { useContractReader } from './ContractReader';

export function usePoints() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? Number(formatUnits(debtBalance, 5)) : 0;

  return points;
}

export function useClimbingSpeed() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1] ? Number(formatUnits(userdata[1], 5)) * 60 * 60 * 24 : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  return { climbingSpeedPerDay, climbingSpeedPerWeek };
}
