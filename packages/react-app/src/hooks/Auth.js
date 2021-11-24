import React, { useState, useEffect, useContext, createContext } from 'react';
import { formatUnits } from '@ethersproject/units';
import { ethers } from 'ethers';
import Onboard from 'bnc-onboard';
import { INFURA_ID, BLOCKNATIVE_KEY, CHAIN_ID, APP_URL, CHAIN, NETWORK_NAME } from 'consts/globals';

const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;

const AuthContext = createContext();
const localStorage = window.localStorage;

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [provider, setProvider] = useState(undefined);
  const [wallet, setWallet] = useState(localStorage.getItem('selectedWallet'));
  const [address, setAddress] = useState(localStorage.getItem('selectedAddress'));
  const [onboard, setOnboard] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState(null);

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

  const addNetworkToWallet = async () => {
    if (!CHAIN.isCustomNetwork) return;

    if (window.ethereum) {
      const hexedChainId = '0x' + Number(CHAIN_ID).toString(16);

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexedChainId }],
        });
      } catch (error) {
        if (error.code === 4902) {
          console.log('Adding new chain');
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: hexedChainId,
                  chainName: CHAIN.name,
                  rpcUrls: CHAIN.rpcUrls,
                  nativeCurrency: CHAIN.nativeCurrency,
                  blockExplorerUrls: CHAIN.blockExplorerUrls,
                },
              ],
            });
          } catch (addError) {
            console.error({ addError });
          }
        }
        console.error(error);
      }
    } else {
      // if no window.ethereum then MetaMask is not installed
      console.error(
        'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html',
      );
    }
  };

  useEffect(() => {
    async function intialize() {
      await addNetworkToWallet();

      const tmpOnboard = Onboard({
        dappId: BLOCKNATIVE_KEY,
        networkId: Number(CHAIN_ID),
        networkName: NETWORK_NAME,
        darkMode: true,
        walletSelect: {
          wallets: [
            { walletName: 'metamask', preferred: true },
            {
              walletName: 'walletConnect',
              infuraKey: INFURA_ID,
            },
            { walletName: 'coinbase' },
            {
              walletName: 'ledger',
              rpcUrl: RPC_URL,
            },
            {
              walletName: 'trezor',
              appUrl: APP_URL,
              rpcUrl: RPC_URL,
            },
          ],
        },
        subscriptions: {
          wallet: onboardWallet => {
            if (onboardWallet.provider) {
              setWallet(onboardWallet);
              const ethersProvider = new ethers.providers.Web3Provider(onboardWallet.provider);
              setProvider(ethersProvider);
              localStorage.setItem('selectedWallet', onboardWallet.name);
            } else {
              setAddress('');
              setProvider(undefined);
              setWallet('');

              localStorage.removeItem('selectedWallet');
              localStorage.removeItem('selectedAddress');
            }
          },
          network: setNetwork,
          address: onboardAddress => {
            localStorage.setItem('selectedAddress', onboardAddress || '');
            setAddress(onboardAddress);
          },
          balance: onboardBalance => {
            if (onboardBalance) {
              const fBalance = parseFloat(formatUnits(onboardBalance));
              setBalance(fBalance.toFixed(2));
            }
          },
        },
        walletCheck: [
          { checkName: 'derivationPath' },
          { checkName: 'connect' },
          { checkName: 'accounts' },
          { checkName: 'network' },
        ],
      });
      setOnboard(tmpOnboard);
    }

    intialize();
  }, []);

  useEffect(() => {
    async function connectWalletAccount() {
      const selectedWallet = localStorage.getItem('selectedWallet');
      if (onboard) {
        const isSelected = await onboard.walletSelect(selectedWallet);
        if (isSelected) {
          const isChecked = await onboard.walletCheck();
          if (isChecked) {
            const state = onboard.getState();
            setProvider(new ethers.providers.Web3Provider(state.wallet.provider));
          }
        }
      }
    }

    connectWalletAccount();
  }, [onboard, network]);

  // Return the user object and auth methods
  return {
    address,
    provider,
    connectAccount,
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
