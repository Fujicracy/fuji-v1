import { formatUnits } from '@ethersproject/units';

export default function PositionRatios(position, price) {
  const { debtBalance, collateralBalance, borrowAsset, collateralAsset } = position;

  let debt = debtBalance ? Number(formatUnits(debtBalance, borrowAsset.decimals)) : 0;
  if (debt < 1) debt = 0;
  const collateral = collateralBalance
    ? Number(formatUnits(collateralBalance, collateralAsset.decimals))
    : 0;
  // liquidation threshold
  const liqThres = 0.75;
  // collateralization and healthy factor
  const factor = 1.33;

  const healthFactor = (collateral * price * liqThres) / debt;
  const maxFactor = collateral * price * liqThres;
  const liqPrice = debt / (collateral * liqThres);
  const ltv = debt / (collateral * price);
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
