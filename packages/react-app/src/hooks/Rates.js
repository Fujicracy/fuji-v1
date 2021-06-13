import { DAI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } from 'constants/providers';

import useContractReader from './ContractReader';

// TODO: Mark - refactor to support multi chains

export default function useRates(contracts) {
  const aaveDai = useContractReader(contracts, 'ProviderAave', 'getBorrowRateFor', [DAI_ADDRESS]);
  const aaveUsdc = useContractReader(contracts, 'ProviderAave', 'getBorrowRateFor', [USDC_ADDRESS]);
  const aaveUsdt = useContractReader(contracts, 'ProviderAave', 'getBorrowRateFor', [USDT_ADDRESS]);

  const compoundDai = useContractReader(contracts, 'ProviderCompound', 'getBorrowRateFor', [
    DAI_ADDRESS,
  ]);
  const compoundUsdc = useContractReader(contracts, 'ProviderCompound', 'getBorrowRateFor', [
    USDC_ADDRESS,
  ]);
  const compoundUsdt = useContractReader(contracts, 'ProviderCompound', 'getBorrowRateFor', [
    USDT_ADDRESS,
  ]);

  const dydxDai = useContractReader(contracts, 'ProviderDYDX', 'getBorrowRateFor', [DAI_ADDRESS]);
  const dydxUsdc = useContractReader(contracts, 'ProviderDYDX', 'getBorrowRateFor', [USDC_ADDRESS]);
  // const dydxUsdt = useContractReader(contracts, 'ProviderDYDX', 'getBorrowRateFor', [USDT_ADDRESS]);

  const ironbankDai = useContractReader(contracts, 'ProviderIronBank', 'getBorrowRateFor', [
    DAI_ADDRESS,
  ]);
  const ironbankUsdc = useContractReader(contracts, 'ProviderIronBank', 'getBorrowRateFor', [
    USDC_ADDRESS,
  ]);
  const ironbankUsdt = useContractReader(contracts, 'ProviderIronBank', 'getBorrowRateFor', [
    USDT_ADDRESS,
  ]);

  const formatRate = rate => {
    const r = (parseFloat(`${rate}`) / 1e27) * 100;
    return rate ? r : undefined;
  };

  // TODO fetch real Fuji APY
  const formatFujiRate = rate => {
    const r = ((parseFloat(`${rate}`) / 1e27) * 100) / 1.15;
    return rate ? r : undefined;
  };

  const minDaiRate = Math.min(aaveDai, compoundDai, dydxDai);
  const minUsdcRate = Math.min(aaveUsdc, compoundUsdc, dydxUsdc);
  const minUsdtRate = Math.min(aaveUsdt, compoundUsdt /* , dydxUsdt */);

  return {
    aave: {
      dai: formatRate(aaveDai),
      usdc: formatRate(aaveUsdc),
      usdt: formatRate(aaveUsdt),
    },
    compound: {
      dai: formatRate(compoundDai),
      usdc: formatRate(compoundUsdc),
      usdt: formatRate(compoundUsdt),
    },
    dydx: {
      dai: formatRate(dydxDai),
      usdc: formatRate(dydxUsdc),
      // usdt: formatRate(dydxUsdt),
    },
    ironbank: {
      dai: formatRate(ironbankDai),
      usdc: formatRate(ironbankUsdc),
      usdt: formatRate(ironbankUsdt),
    },
    fuji: {
      dai: formatFujiRate(minDaiRate),
      usdc: formatFujiRate(minUsdcRate),
      usdt: formatFujiRate(minUsdtRate),
    },
  };
}
