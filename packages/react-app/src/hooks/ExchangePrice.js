import { useState, useEffect } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
//import { Token, WETH, Fetcher, Route } from "@uniswap/sdk";
//import { usePoller } from "eth-hooks";
import { formatUnits } from "@ethersproject/units";
import { CHAINLINK_ABI } from "../constants";
import { useExternalContractLoader } from "./index";

const provider = new JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
);

export default function useExchangePrice(pollTime) {
  const [price, setPrice] = useState(0);

  const oracle = useExternalContractLoader(
    provider,
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    CHAINLINK_ABI
  );

  useEffect(() => {
    async function fetchData() {
      if (oracle) {
        try {
          const r = await oracle.latestRoundData();
          setPrice(parseFloat(formatUnits(r.answer, 8)));  
        }
        catch (e) {
          console.log(e);
        }
      }
    }
    fetchData();
  }, [oracle]);


  //const pollPrice = () => {
    //async function getPrice() {
      //const DAI = new Token(
        //mainnetProvider.network ? mainnetProvider.network.chainId : 1,
        //"0x6B175474E89094C44Da98b954EedeAC495271d0F",
        //18,
      //);
      //const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider);
      //const route = new Route([pair], WETH[DAI.chainId]);
      //setPrice(parseFloat(route.midPrice.toSignificant(6)));
    //}
    //getPrice();
  //};
  //usePoller(pollPrice, pollTime || 9777);

  return price;
}
