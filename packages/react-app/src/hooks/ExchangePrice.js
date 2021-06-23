import { useState, useEffect } from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';
// import { Token, WETH, Fetcher, Route } from "@uniswap/sdk";
// import { usePoller } from "eth-hooks";
import { formatUnits } from '@ethersproject/units';
import { CHAINLINK_ABI } from 'constants/providers';
import useExternalContractLoader from './ExternalContractLoader';

const provider = new JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
);

export default function useExchangePrice(asset = 'ETH') {
  const [price, setPrice] = useState(0);
  let priceFeedProxy;

  switch (asset) {
    case 'DAI':
      priceFeedProxy = '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9';
      break;

    case 'USDC':
      priceFeedProxy = '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6';
      break;

    default:
      priceFeedProxy = '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D';
  }

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

  // const pollPrice = () => {
  // async function getPrice() {
  // const DAI = new Token(
  // mainnetProvider.network ? mainnetProvider.network.chainId : 1,
  // "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  // 18,
  // );
  // const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider);
  // const route = new Route([pair], WETH[DAI.chainId]);
  // setPrice(parseFloat(route.midPrice.toSignificant(6)));
  // }
  // getPrice();
  // };
  // usePoller(pollPrice, pollTime || 9777);

  return price;
}
