import { generateMedia } from 'styled-media-query';
import { ftmIcon, maticIcon, ethIcons } from 'assets/images';
import { capitalizeFirstLetter } from 'helpers/Utils';

export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: { inString: '767px', inNumber: 767 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '1439px', inNumber: 1439 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '1919px', inNumber: 1919 },
};

export const fujiMedia = generateMedia({
  small: '768px',
  medium: '1440px',
  large: '1920px',
});
const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const ETH_CAP_VALUE = process.env.REACT_APP_ETH_CAP_VALUE || 2;

const CHAIN_IDS = {
  ETHEREUM: 1,
  FANTOM: 250,
  POLYGON: 137,
  LOCAL: 31337,
};

const CHAIN_NAMES = {
  ETHEREUM: 'ethereum',
  FANTOM: 'fantom',
  POLYGON: 'polygon',
  LOCAL: 'local',
};

const CHAINS = {
  [CHAIN_NAMES.ETHEREUM]: {
    id: CHAIN_IDS.ETHEREUM,
    name: CHAIN_NAMES.ETHEREUM,
    title: capitalizeFirstLetter(CHAIN_NAMES.ETHEREUM),
    icon: ethIcons.BLUE.toString(),
    isDeployed: true,
    dashboardUrl: 'https://app.fujidao.org/#/dashboard',
  },
  [CHAIN_NAMES.FANTOM]: {
    id: CHAIN_IDS.FANTOM,
    name: CHAIN_NAMES.FANTOM,
    title: capitalizeFirstLetter(CHAIN_NAMES.FANTOM),
    icon: ftmIcon.toString(),
    isDeployed: true,
    dashboardUrl: 'https://fantom.fujidao.org/#/dashboard',
    isCustomNetwork: true,
    rpcUrls: ['https://rpcapi.fantom.network'],
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [CHAIN_NAMES.POLYGON]: {
    id: CHAIN_IDS.POLYGON,
    name: CHAIN_NAMES.POLYGON,
    title: capitalizeFirstLetter(CHAIN_NAMES.POLYGON),
    icon: maticIcon.toString(),
    isCustomNetwork: true,
    isDeployed: false,
    dashboardUrl: 'https://polygon.fujidao.org/#/dashboard',
    rpcUrls: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
    ],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [CHAIN_NAMES.LOCAL]: {
    id: CHAIN_IDS.LOCAL,
    name: CHAIN_NAMES.LOCAL,
    title: capitalizeFirstLetter(CHAIN_NAMES.LOCAL),
    icon: ethIcons.BLUE.toString(),
    isDeployed: false,
    isCustomNetwork: false,
    rpcUrl: 'http://localhost:8545',
  },
};

const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || CHAIN_NAMES.ETHEREUM;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const CHAIN = CHAINS[CHAIN_NAME];

const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3000';
const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'http://localhost:3000';
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY;
const DEPLOYMENT = process.env.REACT_APP_DEPLOYMENT || DEPLOYMENT_TYPES.CORE;

const MERKLE_DIST_ADDR = '0x51407A073fb7C703185f47c3FBB1B915678221b8';
const FUJIFLOPS_NFT_ADDR = '0x376C0AA9150095cB36AdcD472bE390D31C6BeF8F';

const TRANSACTION_ACTIONS = {
  ALL: 'All',
  DEPOSIT: 'Deposit',
  BORROW: 'Borrow',
  PAYBACK: 'Payback',
  WITHDRAW: 'Withdraw',
  LIQUIDATION: 'Liquidation',
};
const TRANSACTION_TYPES = Object.keys(TRANSACTION_ACTIONS).map(key => TRANSACTION_ACTIONS[key]);

const EXPLORER_INFOS = {
  [CHAIN_IDS.ETHEREUM]: { url: 'https://etherscan.io/tx/', name: 'Etherscan' },
  [CHAIN_IDS.FANTOM]: { url: 'https://ftmscan.com/tx/', name: 'Ftmscan' },
  [CHAIN_IDS.LOCAL]: { url: 'https://etherscan.io/tx/', name: 'Etherscan' },
};

const MINIMUM_HEIGHT = {
  MOBILE: 800,
  DESKTOP: 1000,
};

export {
  CHAIN,
  CHAIN_ID,
  CHAIN_IDS,
  CHAIN_NAME,
  CHAIN_NAMES,
  CHAINS,
  APP_URL,
  LANDING_URL,
  INFURA_ID,
  BLOCKNATIVE_KEY,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
  ETH_CAP_VALUE,
  MERKLE_DIST_ADDR,
  FUJIFLOPS_NFT_ADDR,
  TRANSACTION_ACTIONS,
  TRANSACTION_TYPES,
  EXPLORER_INFOS,
  MINIMUM_HEIGHT,
};
