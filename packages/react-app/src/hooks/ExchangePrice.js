import { useState, useEffect } from 'react';
import { formatUnits } from '@ethersproject/units';
import { useAuth } from 'hooks';
import { CHAINLINK_ABI } from 'consts/abis';
import { ASSETS } from 'consts/assets';
import useExternalContractLoader from './ExternalContractLoader';

export default function useExchangePrice(asset = 'ETH') {
  const { provider } = useAuth();

  const [price, setPrice] = useState(0);
  const priceFeedProxy = ASSETS[asset].oracle;

  const oracle = useExternalContractLoader(provider, priceFeedProxy, CHAINLINK_ABI);

  useEffect(() => {
    async function fetchData() {
      if (oracle) {
        try {
          const r = await oracle.latestRoundData();
          setPrice(parseFloat(formatUnits(r.answer, 8)));
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchData();
  }, [oracle]);

  return price;
}
