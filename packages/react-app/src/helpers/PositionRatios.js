import { formatUnits } from '@ethersproject/units';

const MAX_HEALTH_FACTOR = 1000;

export default function PositionRatios(position, collateralPrice, borrowPrice) {
  const { vault, debtBalance, collateralBalance } = position;
  const { borrowAsset, collateralAsset, threshold } = vault;

  let debt = debtBalance ? Number(formatUnits(debtBalance, borrowAsset.decimals)) : 0;

  if (debt.toFixed(8) <= 0.00000001) debt = 0;

  const collateral = collateralBalance
    ? Number(formatUnits(collateralBalance, collateralAsset.decimals))
    : 0;
  // liquidation threshold
  const liqThres = threshold ? threshold / 100 : 0.75;
  // collateralization and healthy factor
  const factor = 1 / liqThres;

  const healthFactor =
    debt === 0 ? Infinity : (collateral * collateralPrice * liqThres) / (debt * borrowPrice);
  const maxFactor = collateral * collateralPrice * liqThres;
  const liqPrice = (debt * borrowPrice) / (collateral * liqThres);
  const ltv = (debt * borrowPrice) / (collateral * collateralPrice);
  const borrowLimit = Math.min(ltv * factor, 1);

  return {
    healthFactor: healthFactor > MAX_HEALTH_FACTOR || !healthFactor ? Infinity : healthFactor,
    maxFactor,
    liqPrice,
    ltv,
    borrowLimit,
  };
}
