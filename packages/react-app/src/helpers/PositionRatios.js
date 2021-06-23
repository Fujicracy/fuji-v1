import { formatUnits, formatEther } from '@ethersproject/units';

export default function PositionRatios(position, price) {
  const { debtBalance, collateralBalance } = position;

  const debt = debtBalance ? Number(formatUnits(debtBalance, position.decimals)) : 0;
  const collateral = collateralBalance ? Number(formatEther(collateralBalance, 18)) : 0;
  // liquidation threshold
  const liqThres = 0.75;
  // collateralization and healthy factor
  const factor = 1.33;

  const healthFactor = (collateral * price * liqThres) / debt;
  const maxFactor = collateral * price * liqThres;
  const liqPrice = debt / (collateral * liqThres);
  const ltv = debt / (collateral * price);
  const borrowLimit = Math.min(ltv * factor, 1);

  return {
    healthFactor: healthFactor || 0,
    maxFactor,
    liqPrice,
    ltv,
    borrowLimit,
  };
}
