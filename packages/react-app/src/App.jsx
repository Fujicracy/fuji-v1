import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useContractLoader, useExternalContractLoader } from "./hooks";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI } from "./constants";
//import AppBar from "@material-ui/core/AppBar";
//import Toolbar from '@material-ui/core/Toolbar';
//import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

import Home from "./Home";
import Simulation from "./Simulation";
import InitBorrow from "./InitBorrow";
import MyPositions from "./MyPositions";
import Dashboard from "./Dashboard";
import Infos from "./Infos";
import Team from "./Team";

const useStyles = makeStyles(theme => 
  createStyles()
);

function App(props) {
  const classes = useStyles();
  const [injectedProvider, setInjectedProvider] = useState();
  const [route, setRoute] = useState();

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

  //{address.substr(0, 5) + "..." + address.substr(-4, 4)}
  //<li>
    //<a href="#"><span class="material-icons">light_mode</span></a>
  //</li>
  return (
    <div> 
      <header>
        <a href="#" class="logo">
          <img src="https://assets.codepen.io/194136/fujiDao.svg" />
        </a>

        <nav>
          <ul>
            <li><a href="#" class="current">Dashboard</a></li>
            <li><a href="#">All positions</a></li>
            <li><a href="#" class="button-nav">Connect Wallet</a></li>
          </ul>
        </nav>
      </header>
      <div class="container initial-step">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Home
                address={address}
                loadWeb3Modal={loadWeb3Modal}
                setRoute={setRoute}
              />
            </Route>
            <Route path="/init-borrow">
              <InitBorrow
                contracts={contracts}
                address={address}
                setRoute={setRoute}
                provider={userProvider}
              />
            </Route>
            <Route path="/dashboard">
              <Dashboard
                contracts={contracts}
                address={address}
                setRoute={setRoute}
                provider={userProvider}
              />
            </Route>
            <Route path="/my-positions">
              <MyPositions
                contracts={contracts}
                address={address}
                setRoute={setRoute}
              />
            </Route>
            <Route path="/simulation">
              <Simulation
                address={address}
                setRoute={setRoute}
              />
            </Route>
            <Route path="/team">
              <Team
                setRoute={setRoute}
              />
            </Route>
            <Route path="/about">
              <Infos
                setRoute={setRoute}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
      <div class="bg-effect"></div>
    </div>
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
