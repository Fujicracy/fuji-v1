import { useContractReader } from './index'
import { DAI_ADDRESS, USDC_ADDRESS } from '../constants'

export default function useRates(contracts) {
  const aaveDai = useContractReader(contracts, 'ProviderAave', 'getBorrowRateFor', [DAI_ADDRESS])
  const aaveUsdc = useContractReader(contracts, 'ProviderAave', 'getBorrowRateFor', [USDC_ADDRESS])

  const compoundDai = useContractReader(contracts, 'ProviderCompound', 'getBorrowRateFor', [
    DAI_ADDRESS,
  ])
  const compoundUsdc = useContractReader(contracts, 'ProviderCompound', 'getBorrowRateFor', [
    USDC_ADDRESS,
  ])

  const dydxDai = useContractReader(contracts, 'ProviderDYDX', 'getBorrowRateFor', [DAI_ADDRESS])
  const dydxUsdc = useContractReader(contracts, 'ProviderDYDX', 'getBorrowRateFor', [USDC_ADDRESS])

  const formatRate = rate => {
    const r = (parseFloat(`${rate}`) / 1e27) * 100
    return rate ? r : undefined
  }

  // TODO fetch real Fuji APY
  const formatFujiRate = rate => {
    const r = ((parseFloat(`${rate}`) / 1e27) * 100) / 1.15
    return rate ? r : undefined
  }

  const minDaiRate = Math.min(aaveDai, compoundDai, dydxDai)
  const minUsdcRate = Math.min(aaveUsdc, compoundUsdc, dydxUsdc)

  return {
    aave: {
      dai: formatRate(aaveDai),
      usdc: formatRate(aaveUsdc),
    },
    compound: {
      dai: formatRate(compoundDai),
      usdc: formatRate(compoundUsdc),
    },
    dydx: {
      dai: formatRate(dydxDai),
      usdc: formatRate(dydxUsdc),
    },
    fuji: {
      dai: formatFujiRate(minDaiRate),
      usdc: formatFujiRate(minUsdcRate),
    },
  }
}
