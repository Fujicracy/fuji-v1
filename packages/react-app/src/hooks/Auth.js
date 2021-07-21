import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
// import { useUserAddress } from 'eth-hooks';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Onboard from 'bnc-onboard';

const AuthContext = createContext();

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
  },
  theme: {
    background: 'rgb(0, 0, 0)',
    main: 'rgb(245, 245, 253)',
    secondary: 'rgba(245, 245, 253, 0.8)',
    border: 'rgb(240, 1, 79)',
    hover: 'rgb(41, 41, 41)',
  },
});

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [provider, setProvider] = useState();
  // const address = useUserAddress(provider);
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState();
  const [onboard, setOnboard] = useState(null);

  async function connectAccount() {
    const isSelected = await onboard.walletSelect();
    console.log({ isSelected });
    if (isSelected) {
      const isChecked = await onboard.walletCheck();
      if (isChecked) {
        const state = onboard.getState();
        setAddress(state.address);
        setProvider(new ethers.providers.Web3Provider(state.wallet.provider));
        console.log({ state });
      }
    }
  }

  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, [setProvider]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  useEffect(() => {
    const tmpOnboard = Onboard({
      dappId: process.env.REACT_APP_BNC_API_KEY, // [String] The API key created by step one above
      networkId: Number(process.env.REACT_APP_CHAIN_ID), // [Integer] The Ethereum network ID your Dapp uses.
      darkMode: true,
      subscriptions: {
        wallet: onboardWallet => {
          if (onboardWallet.provider) {
            setWallet(onboardWallet);
            // store the selected wallet name to be retrieved next time the app loads

            const ethersProvider = new ethers.providers.Web3Provider(onboardWallet.provider);

            setProvider(ethersProvider);

            window.localStorage.setItem('selectedWallet', onboardWallet.name);
          } else {
            setProvider(null);
            setWallet({});
          }
        },
        address: onboardAddress => {
          window.localStorage.setItem('selectedAddress', onboardAddress);
        },
      },
    });

    setOnboard(tmpOnboard);
  }, []);

  useEffect(() => {
    async function connectWalletAccount() {
      const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');
      const previouslySelectedAddress = window.localStorage.getItem('selectedAddress');
      console.log({ previouslySelectedWallet, previouslySelectedAddress });
      if (previouslySelectedWallet && previouslySelectedAddress && onboard) {
        await onboard.walletSelect(previouslySelectedWallet);
        await onboard.walletCheck(previouslySelectedAddress);

        setWallet(previouslySelectedWallet);
        setAddress(previouslySelectedAddress);
      }
    }

    connectWalletAccount();
  }, [onboard]);

  // Return the user object and auth methods
  return {
    address,
    provider,
    connectAccount,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    onboard,
    wallet,
  };
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};
