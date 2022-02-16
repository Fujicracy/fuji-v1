import { useEffect, useState } from 'react';
import { useAuth, useContractLoader, useContractReader } from 'hooks';
import { formatUnits } from '@ethersproject/units';

export function usePoints() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (debtBalance) {
      const newPoints = Number(formatUnits(debtBalance, 5));
      setPoints(newPoints);
    }
  }, [debtBalance]);

  return points;
}

export function useClimbingSpeed() {
  const { address } = useAuth();
  console.log({ address });
  const contracts = useContractLoader();
  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);

  const [climbingSpeed, setclimbingSpeed] = useState({
    climbingSpeedPerDay: 0,
    climbingSpeedPerWeek: 0,
  });

  useEffect(() => {
    if (userdata[1]) {
      console.log({ userdata });
      const climbingSpeedPerDay = Number(formatUnits(userdata[1], 5)) * 60 * 60 * 24;
      const climbingSpeedPerWeek = climbingSpeedPerDay * 7;
      console.log({ climbingSpeedPerDay, climbingSpeedPerWeek });
      setclimbingSpeed({ climbingSpeedPerDay, climbingSpeedPerWeek });
    }
  }, [userdata]);

  return climbingSpeed;
}
