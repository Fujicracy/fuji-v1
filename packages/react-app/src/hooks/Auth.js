import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import Onboard from 'bnc-onboard';
import {
  INFURA_ID,
  BLOCKNATIVE_KEY,
  APP_URL,
  CHAIN,
  CHAIN_ID,
  CHAIN_NAME,
  CHAINS,
  CHAIN_NAMES,
  DEPLOYMENT_TYPES,
} from 'consts/globals';

const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;

const AuthContext = createContext();
const localStorage = window.localStorage;

async function addNetworkToWallet() {
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
}

const onboardConfigs = {
  dappId: BLOCKNATIVE_KEY,
  darkMode: true,
  walletSelect: {
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
      },
      {
        walletName: 'trezor',
        appUrl: APP_URL,
        rpcUrl: RPC_URL,
      },
    ],
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'connect' },
    { checkName: 'accounts' },
    { checkName: 'network' },
  ],
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const history = useHistory();
  const [provider, setProvider] = useState(undefined);
  const [address, setAddress] = useState(localStorage.getItem('selectedAddress'));
  const [onboard, setOnboard] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [networkName, setNetworkName] = useState(CHAIN_NAMES.ETHEREUM);
  const [deployment, setDeployment] = useState(DEPLOYMENT_TYPES.CORE);

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

  async function changeNetwork(id) {
    onboard.config({ networkId: id });
    setDeployment(DEPLOYMENT_TYPES.CORE);
    await onboard.walletCheck();
  }

  const subscriptions = useMemo(() => {
    return {
      wallet: wallet => {
        if (wallet.provider) {
          const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
          setProvider(ethersProvider);
          localStorage.setItem('selectedWallet', wallet.name);
        } else {
          setAddress('');
          setProvider(undefined);

          localStorage.removeItem('selectedWallet');
          localStorage.removeItem('selectedAddress');
        }
      },
      network: id => {
        if (id) {
          setNetworkId(id);
          if (id === 31337) {
            // when local, use what's stored in .env
            setNetworkName(CHAIN_NAME);
          } else {
            const n = Object.values(CHAINS).find(v => v.id === id && v.isDeployed);
            if (n) {
              setNetworkName(n.name);
            } else {
              // unsupported network
              console.log('Unsupported network');
              history.replace('/dashboard/wrong-network');
            }
          }
        }
      },
      address: onboardAddress => {
        localStorage.setItem('selectedAddress', onboardAddress || '');
        setAddress(onboardAddress);
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function intialize() {
      await addNetworkToWallet();

      const tmpOnboard = Onboard({
        networkId: Number(CHAIN_ID),
        networkName: CHAIN_NAME,
        subscriptions,
        ...onboardConfigs,
      });
      setOnboard(tmpOnboard);
    }

    intialize();
  }, [subscriptions]);

  useEffect(() => {
    async function connectWalletAccount() {
      const selectedWallet = localStorage.getItem('selectedWallet');
      const isSelected = await onboard.walletSelect(selectedWallet);
      const state = onboard.getState();
      if (networkId && networkId !== state.appNetworkID) {
        await changeNetwork(networkId);
      }
      if (isSelected) {
        setProvider(new ethers.providers.Web3Provider(state.wallet.provider));
      }
    }

    if (onboard) connectWalletAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboard, networkId]);

  // Return the user object and auth methods
  return {
    address,
    provider,
    networkId,
    networkName,
    changeNetwork,
    deployment,
    setDeployment,
    connectAccount,
    onboard,
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
