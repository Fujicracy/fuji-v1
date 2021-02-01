import React, { useCallback, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useUserProvider } from "./hooks";
import { INFURA_ID } from "./constants";
import { Layout, Button } from 'antd';

function FujiHome({ address }) {
  const [injectedProvider, setInjectedProvider] = useState();

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  const { Header, Footer, Content } = Layout;

  const onClickConnect = () => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }

  return (
    <div className="App"> 
      <Layout>
        <Header className="header">
          <h1 className="logo-title">
            Fuji
            <span className="tab-title">
              Home
            </span>
          </h1>
        </Header>

        <Content>{
          !address
          ? <Button onClick={onClickConnect} className="button" type="primary" shape="round">
              Connect Wallet
            </Button> 
          : <Button href="vaults" className="button" type="primary" shape="round">
              Launch App
            </Button> 
        }
        </Content>

        <Footer>                
          <Button href="about" type="primary">
            Infos
          </Button>

          <Button href="team" type="primary">
            Team
          </Button>
        </Footer>
      </Layout>
    </div>
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

export default FujiHome;
