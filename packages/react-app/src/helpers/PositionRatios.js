import { formatUnits } from '@ethersproject/units';

export default function PositionRatios(position, collateralPrice, borrowPrice) {
  const { debtBalance, collateralBalance, borrowAsset, collateralAsset, threshold } = position;

  let debt = debtBalance ? Number(formatUnits(debtBalance, borrowAsset.decimals)) : 0;
  if (debt.toFixed(8) <= 0.00000001) debt = 0;
  const collateral = collateralBalance
    ? Number(formatUnits(collateralBalance, collateralAsset.decimals))
    : 0;
  // liquidation threshold
  const liqThres = threshold ? threshold / 100 : 0.75;
  // collateralization and healthy factor
  const factor = 1.33;

  const healthFactor =
    debt === 0 ? Infinity : (collateral * collateralPrice * liqThres) / (debt * borrowPrice);
  const maxFactor = collateral * collateralPrice * liqThres;
  const liqPrice = (debt * borrowPrice) / (collateral * liqThres);
  const ltv = (debt * borrowPrice) / (collateral * collateralPrice);
  const borrowLimit = Math.min(ltv * factor, 1);
  // if (price > 0) {
  //   debugger;
  // }

  return {
    healthFactor: healthFactor || 0,
    maxFactor,
    liqPrice,
    ltv,
    borrowLimit,
  };
}
