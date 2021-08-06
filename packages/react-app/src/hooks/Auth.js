import React, { useState, useEffect, useContext, createContext } from 'react';
import { formatUnits } from '@ethersproject/units';
// import { useUserAddress } from 'eth-hooks';
// import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
// import Web3Modal from 'web3modal';
// import WalletConnectProvider from '@walletconnect/web3-provider';
import Onboard from 'bnc-onboard';
import { INFURA_ID, CHAIN_ID, APP_URL } from 'consts/globals';

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

  const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;

  async function connectAccount() {
    const isSelected = await onboard.walletSelect();
    if (isSelected) {
      const isChecked = await onboard.walletCheck();
      if (isChecked) {
        const state = onboard.getState();
        setAddress(state.address);
        setProvider(new ethers.providers.Web3Provider(state.wallet.provider));
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
      networkId: Number(CHAIN_ID), // [Integer] The Ethereum network ID your Dapp uses.
      darkMode: true,
      walletSelect: {
        // Metamask, WalletConnect, Ledger, Trezor, Coinbase, Formatic as stated in the card
        wallets: [
          { walletName: 'metamask', preferred: true },
          {
            walletName: 'walletConnect',
            infuraKey: INFURA_ID,
            preferred: true,
          },
          { walletName: 'coinbase' },
          {
            walletName: 'ledger',
            rpcUrl: RPC_URL,
            preferred: true,
          },
          {
            walletName: 'trezor',
            appUrl: APP_URL,
            rpcUrl: RPC_URL,
            preferred: true,
          },
          {
            walletName: 'fortmatic',
            apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
          },
        ],
      },
      subscriptions: {
        wallet: onboardWallet => {
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
  }, [RPC_URL]);

  useEffect(() => {
    async function connectWalletAccount() {
      const previouslySelectedWallet = window.localStorage.getItem('selectedWallet');
      const previouslySelectedAddress = window.localStorage.getItem('selectedAddress');
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
