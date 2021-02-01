import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import { Web3Provider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useContractLoader, useContractReader } from "./hooks";
import { INFURA_ID } from "./constants";
import FujiHome from "./FujiHome";
import FujiInfos from "./FujiInfos/FujiInfos";
import FujiTeam from "./FujiTeam/FujiTeam";
import FujiVaults from "./FujiVaults/FujiVaults";

function FujiApp(props) {
  const [injectedProvider, setInjectedProvider] = useState();

  const userProvider = useUserProvider(injectedProvider);
  const address = useUserAddress(userProvider);

  //const readContracts = useContractLoader(userProvider)

  //const writeContracts = useContractLoader(userProvider)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <FujiHome
            signer={userProvider ? userProvider.getSigner() : null}
            provider={userProvider}
            address={address}
          />
        </Route>
        <Route path="/vaults">
          <FujiVaults />
        </Route>
        <Route path="/team">
          <FujiTeam />
        </Route>
        <Route path="/about">
          <FujiInfos />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default FujiApp;
