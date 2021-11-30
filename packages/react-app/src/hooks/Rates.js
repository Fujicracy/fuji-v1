import { useContractReader, useResources } from './index';

const formatRate = rate => {
  const r = (parseFloat(`${rate}`) / 1e27) * 100;
  return rate ? r : undefined;
};

export default function useRates(contracts) {
  const { vaults } = useResources();
  const rates = {};

  for (let i = 0; i < vaults.length; i += 1) {
    const vault = vaults[i];
    for (let p = 0; p < vault.providers.length; p += 1) {
      const provider = vault.providers[p];
      /* eslint-disable react-hooks/rules-of-hooks */
      const rate = useContractReader(contracts, provider.name, 'getBorrowRateFor', [
        vault.borrowAsset.address,
      ]);
      rates[provider.id] = {
        ...rates[provider.id],
        [vault.borrowAsset.id]: formatRate(rate),
      };
    }
  }

  return rates;
}
