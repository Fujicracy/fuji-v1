import React, { useState, useEffect, useContext, createContext } from 'react';
import { formatUnits } from '@ethersproject/units';
// import { useUserAddress } from 'eth-hooks';
// import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
// import Web3Modal from 'web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
import Onboard from 'bnc-onboard';

const AuthContext = createContext();

// const web3Modal = new Web3Modal({
//   // network: "mainnet", // optional
//   cacheProvider: true, // optional
//   providerOptions: {
//     walletconnect: {
//       package: WalletConnectProvider, // required
//       options: {
//         infuraId: process.env.REACT_APP_INFURA_ID,
//       },
//     },
//   },
//   theme: {
//     background: 'rgb(0, 0, 0)',
//     main: 'rgb(245, 245, 253)',
//     secondary: 'rgba(245, 245, 253, 0.8)',
//     border: 'rgb(240, 1, 79)',
//     hover: 'rgb(41, 41, 41)',
//   },
// });

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [provider, setProvider] = useState(undefined);
  // const address = useUserAddress(provider);
  const [wallet, setWallet] = useState('');
  const [address, setAddress] = useState('');
  const [onboard, setOnboard] = useState(null);
  const [balance, setBalance] = useState(0);

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

  // async function disconnectAccount() {
  //   if (onboard) {
  //     console.log('disconnecting account');
  //     setAddress();
  //     setProvider(undefined);
  //     setWallet(null);

  //     window.localStorage.removeItem('selectedWallet');
  //     window.localStorage.removeItem('selectedAddress');
  //     onboard.walletReset();
  //   }
  // }

  // const loadWeb3Modal = useCallback(async () => {
  //   const newProvider = await web3Modal.connect();
  //   setProvider(new Web3Provider(newProvider));
  // }, [setProvider]);

  // const logoutOfWeb3Modal = async () => {
  //   await web3Modal.clearCachedProvider();
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1);
  // };

  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     loadWeb3Modal();
  //   }
  // }, [loadWeb3Modal]);

  useEffect(() => {
    const tmpOnboard = Onboard({
      dappId: process.env.REACT_APP_BNC_API_KEY, // [String] The API key created by step one above
      networkId: Number(process.env.REACT_APP_CHAIN_ID), // [Integer] The Ethereum network ID your Dapp uses.
      darkMode: true,
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          {
            walletName: 'walletConnect',
            infuraKey: process.env.REACT_APP_INFURA_ID,
            preferred: true,
          },
        ],
      },
      subscriptions: {
        wallet: onboardWallet => {
          console.log('Onboard subscription');
          if (onboardWallet.provider) {
            setWallet(onboardWallet);
            const ethersProvider = new ethers.providers.Web3Provider(onboardWallet.provider);
            setProvider(ethersProvider);
            window.localStorage.setItem('selectedWallet', onboardWallet.name);
          } else {
            setAddress('');
            setProvider(undefined);
            setWallet('');

            window.localStorage.removeItem('selectedWallet');
            window.localStorage.removeItem('selectedAddress');
          }
        },
        address: onboardAddress => {
          window.localStorage.setItem('selectedAddress', onboardAddress);
          if (onboardAddress) setAddress(onboardAddress);
          else setAddress('');
        },
        balance: onboardBalance => {
          if (onboardBalance) {
            const fBalance = parseFloat(formatUnits(onboardBalance));
            setBalance(fBalance.toFixed(2));
          }
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
    // disconnectAccount,
    // loadWeb3Modal,
    // logoutOfWeb3Modal,
    onboard,
    wallet,
    balance,
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
