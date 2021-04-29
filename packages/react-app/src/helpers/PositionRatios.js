export default function PositionRatios(collateralBalance, debtBalance, price) {
  // liquidation threshold
  const liqThres = 0.75;
  // collateralization and healthy factor
  const factor = 1.33;

  const healthFactor = ((collateralBalance * price) * liqThres) / debtBalance;
  const maxFactor = (collateralBalance * price) * liqThres;
  const liqPrice = debtBalance / (collateralBalance * liqThres); 
  const ltv = debtBalance / (collateralBalance * price);
  const borrowLimit = Math.min(ltv * factor, 1);

  return {
    healthFactor,
    maxFactor,
    liqPrice,
    ltv,
    borrowLimit,
  };
}
