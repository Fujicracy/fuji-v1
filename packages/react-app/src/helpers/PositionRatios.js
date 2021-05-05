import { formatUnits, formatEther } from "@ethersproject/units";

export default function PositionRatios(position, price) {

  const { debtBalance, collateralBalance, borrowAsset } = position;
  const decimals = borrowAsset === "USDC" ? 6 : 18;

  const debt = debtBalance ? Number(formatUnits(debtBalance, decimals)) : 0;
  const collateral = collateralBalance ? Number(formatEther(collateralBalance)) : 0;
  // liquidation threshold
  const liqThres = 0.75;
  // collateralization and healthy factor
  const factor = 1.33;

  const healthFactor = ((collateral * price) * liqThres) / debt;
  const maxFactor = (collateral * price) * liqThres;
  const liqPrice = debt / (collateral * liqThres);
  const ltv = debt / (collateral * price);
  const borrowLimit = Math.min(ltv * factor, 1);

  return {
    healthFactor: healthFactor ? healthFactor : 0,
    maxFactor,
    liqPrice,
    ltv,
    borrowLimit,
  };
}
