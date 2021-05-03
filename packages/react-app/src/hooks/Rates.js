import { useContractReader } from "./index";
import { DAI_ADDRESS, USDC_ADDRESS } from "../constants";

export default function useRates(contracts) {
  const aaveDai = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );
  const aaveUsdc = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [USDC_ADDRESS]
  );

  const compoundDai = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );
  const compoundUsdc = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [USDC_ADDRESS]
  );

  const formatRate = (rate) => {
    const r = parseFloat(`${rate}`) / 1e27 * 100;
    return rate ? r : undefined;
  }

  // TODO fetch real Fuji APY
  const formatFujiRate = (rate) => {
    const r = parseFloat(`${rate}`) / 1e27 * 100 / 1.15;
    return rate ? r : undefined;
  }

  return {
    aave: {
      dai: formatRate(aaveDai),
      usdc: formatRate(aaveUsdc),
    },
    compound: {
      dai: formatRate(compoundDai),
      usdc: formatRate(compoundUsdc),
    },
    fuji: {
      dai: aaveDai < (compoundDai) ? formatFujiRate(aaveDai) : formatFujiRate(compoundDai),
      usdc: aaveUsdc < (compoundUsdc) ? formatFujiRate(aaveUsdc) : formatFujiRate(compoundUsdc),
    }
  }
}

