import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link, NavLink } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useContractLoader, useExternalContractLoader } from "./hooks";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI } from "./constants";

import Home from "./Home";
import Dashboard from "./Dashboard/Dashboard";
import Infos from "./Infos";
import Team from "./Team";

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();

  const userProvider = useUserProvider(injectedProvider);
  const address = useUserAddress(userProvider);

  const contracts = useContractLoader(userProvider)
  const DAIContract = useExternalContractLoader(userProvider, DAI_ADDRESS, DAI_ABI);
  if (contracts) {
    contracts.DAI = DAIContract;
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  //<li>
    //<Link to="#"><span className="material-icons">light_mode</span></Link>
  //</li>
  return (
    <BrowserRouter>
      <header>
        <Link to="/" className="logo">
          <img alt="logo" src="https://assets.codepen.io/194136/fujiDao.svg" />
        </Link>

        <nav>
          <ul>
          {address && (
            <li>
              <NavLink to="/dashboard" activeClassName="current">Dashboard</NavLink>
            </li>
          )}
            <li>
              <NavLink to="/my-positions" activeClassName="current">All positions</NavLink>
            </li>
            <li>{
              address
                ? <a href="javasctip:void(0)" className="button-nav connected">
                  {address.substr(0, 5) + "..." + address.substr(-4, 4)}
                </a>
                : <a href="javasctip:void(0)" className="button-nav" onClick={() => loadWeb3Modal()}>
                  Connect Wallet
                </a>
              }
            </li>
          </ul>
        </nav>
      </header>
      <Switch>
        <Route exact path="/">
          <Home
            address={address}
            loadWeb3Modal={loadWeb3Modal}
          />
        </Route>
        <Route path="/dashboard">
          <Dashboard
            contracts={contracts}
            address={address}
            provider={userProvider}
          />
        </Route>
        <Route path="/team">
          <Team
          />
        </Route>
        <Route path="/about">
          <Infos
          />
        </Route>
      </Switch>
      <div className="bg-effect"></div>
    </BrowserRouter>
  );
}
//signer={userProvider ? userProvider.getSigner() : null}

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

//const logoutOfWeb3Modal = async () => {
//await web3Modal.clearCachedProvider();
//setTimeout(() => {
//window.location.reload();
//}, 1);
//};

export default App;
