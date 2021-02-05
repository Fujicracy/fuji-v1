import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
//import "./App.css";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider, useContractLoader, useContractReader } from "./hooks";
import { INFURA_ID } from "./constants";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

import FujiHome from "./FujiHome";
import FujiVaults from "./FujiVaults";
import VaultETHDAI from "./VaultETHDAI";
import Dashboard from "./Dashboard";
import FujiInfos from "./FujiInfos/FujiInfos";
import FujiTeam from "./FujiTeam/FujiTeam";

const useStyles = makeStyles(theme => 
  createStyles({
    root: {
      fontSize: "x-large",
      fontStyle: "italic",
      textAlign: "center",
    },
    header: {
      justifyContent: 'space-between',
      overflowX: 'auto',
      height: "70px",
    },
    titleHome: {
      textDecoration: "none",
      color: "#fff"
    },
    titleSquared: {
      margin: "0 10px",
      background: "#fff",
      color: theme.palette.secondary.main,
      fontWeight: "900",
      padding: "1px 15px",
      boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25)"
    },
    titleRounded: {
      margin: "0 10px",
      background: "#fff",
      color: theme.palette.secondary.main,
      fontWeight: "900",
      padding: "5px 0",
      boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25)",
      borderRadius: "50px",
      maxWidth: "50%",
      flex: 1
    },
    logo: {
      background: "#fff",
      padding: "1px 0 0 5px",
      boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25)"
    },
  })
);

function FujiApp(props) {
  const classes = useStyles();
  const [injectedProvider, setInjectedProvider] = useState();
  const [route, setRoute] = useState();

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
    <div className={classes.root}> 
      <AppBar>
        <Toolbar className={classes.header}>
          <Toolbar>
            <Typography
              variant="h4"
              component="a"
              className={classes.titleHome}
              href="/"
            >
              Fuji
            </Typography>
            <Typography
              variant="h4"
              className={classes.titleSquared}
            >{route === '/'
              ? "Home"
              : route === '/vaults'
              ? "Vaults"
              : route === '/vaults/ethdai'
              ? "Vaults"
              : route === '/dashboard'
              ? "Dashboard"
              : "Other"
            }
            </Typography>
          </Toolbar>
          <Typography
            component="h1"
            variant="h4"
            className={classes.titleRounded}
          >
            Borrowing Agreggator
          </Typography>
          <Toolbar>
            <Avatar
              alt="Fuji Logo"
              variant="square"
              src="/logo192.png"
              className={classes.logo}
            />
          </Toolbar>
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: "100px" }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <FujiHome
                address={address}
                loadWeb3Modal={loadWeb3Modal}
                setRoute={setRoute}
              />
            </Route>
            <Route path="/dashboard">
              <Dashboard
                address={address}
                setRoute={setRoute}
                provider={userProvider}
              />
            </Route>
            <Route path="/vaults/ethdai">
              <VaultETHDAI
                address={address}
                setRoute={setRoute}
                provider={userProvider}
              />
            </Route>
            <Route path="/vaults">
              <FujiVaults
                address={address}
                setRoute={setRoute}
              />
            </Route>
            <Route path="/team">
              <FujiTeam />
            </Route>
            <Route path="/about">
              <FujiInfos />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
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

export default FujiApp;
