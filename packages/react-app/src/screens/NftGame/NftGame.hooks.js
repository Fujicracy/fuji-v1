import { useEffect, useState } from 'react';
import { useAuth, useContractLoader, useContractReader } from 'hooks';
import { formatUnits } from '@ethersproject/units';

export function usePoints() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const newPoints = debtBalance ? Number(formatUnits(debtBalance, 5)) : 0;

  const [points, setPoints] = useState(0);
  useEffect(() => setPoints(newPoints), [newPoints]);

  return points;
}

export function useClimbingSpeed() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1] ? Number(formatUnits(userdata[1], 5)) * 60 * 60 * 24 : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  const [climbingSpeed, setclimbingSpeed] = useState({ climbingSpeedPerDay, climbingSpeedPerWeek });
  useEffect(
    () => setclimbingSpeed({ climbingSpeedPerDay, climbingSpeedPerWeek }),
    [climbingSpeedPerDay, climbingSpeedPerWeek],
  );

  return climbingSpeed;
}
