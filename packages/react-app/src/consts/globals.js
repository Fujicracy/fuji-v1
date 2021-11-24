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
  [BREAKPOINT_NAMES.MOBILE]: { inString: '450px', inNumber: 450 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '768px', inNumber: 1120 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '1280px', inNumber: 1170 },
  [BREAKPOINT_NAMES.LARGE]: { inString: '1920px', inNumber: 1440 },
};

export const fujiMedia = generateMedia({
  small: '450px',
  medium: '1120px',
  large: '1170px',
});

const CHAIN_IDS = {
  FANTOM: 250,
  MAINNET: 1,
  KOVAN: 42,
  LOCAL: 31337,
  POLYGON: 137,
};

const NETWORKS = {
  [CHAIN_IDS.MAINNET]: 'Mainnet',
  [CHAIN_IDS.KOVAN]: 'Kovan',
  [CHAIN_IDS.FANTOM]: 'Fantom',
  [CHAIN_IDS.LOCAL]: 'Local',
  [CHAIN_IDS.POLYGON]: 'Polygon',
};

const DEPLOYMENT_TYPES = {
  CORE: 'core',
  FUSE: 'fuse',
};

const ETH_CAP_VALUE = process.env.REACT_APP_ETH_CAP_VALUE || 2;

const CHAIN_NAMES = {
  ETHEREUM: 'ethereum',
  FANTOM: 'fantom',
  POLYGON: 'polygon',
  LOCAL: 'local',
};
const CHAINS = {
  [CHAIN_NAMES.ETHEREUM]: {
    id: CHAIN_NAMES.ETHEREUM,
    name: capitalizeFirstLetter(CHAIN_NAMES.ETHEREUM),
    icon: ethIcons.BLUE.toString(),
    isDeployed: true,
    dashboardUrl: 'https://app.fujidao.org/#/dashboard',
  },
  [CHAIN_NAMES.FANTOM]: {
    id: CHAIN_NAMES.FANTOM,
    name: capitalizeFirstLetter(CHAIN_NAMES.FANTOM),
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
    id: CHAIN_NAMES.POLYGON,
    name: capitalizeFirstLetter(CHAIN_NAMES.POLYGON),
    icon: maticIcon.toString(),
    isCustomNetwork: true,
    isDeployed: true,
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
    id: CHAIN_NAMES.LOCAL,
    name: capitalizeFirstLetter(CHAIN_NAMES.LOCAL),
    icon: ethIcons.BLUE.toString(),
    isDeployed: false,
    isCustomNetwork: false,
    rpcUrl: 'http://localhost:8545',
  },
};

const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || CHAIN_NAMES.ETHEREUM;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const CHAIN = CHAINS[CHAIN_NAME];

const NETWORK_NAME = NETWORKS[CHAIN_ID];
const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3000';
const LANDING_URL = process.env.REACT_APP_LANDING_URL || 'http://localhost:3000';
const INFURA_ID = process.env.REACT_APP_INFURA_ID;
const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY;
const DEPLOYMENT = process.env.REACT_APP_DEPLOYMENT || DEPLOYMENT_TYPES.CORE;

const MERKLE_DIST_ADDR = '0x51407A073fb7C703185f47c3FBB1B915678221b8';
const FUJIFLOPS_NFT_ADDR = '0x376C0AA9150095cB36AdcD472bE390D31C6BeF8F';

export {
  CHAIN,
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_NAMES,
  CHAINS,
  NETWORK_NAME,
  APP_URL,
  LANDING_URL,
  INFURA_ID,
  BLOCKNATIVE_KEY,
  DEPLOYMENT,
  DEPLOYMENT_TYPES,
  ETH_CAP_VALUE,
  MERKLE_DIST_ADDR,
  FUJIFLOPS_NFT_ADDR,
};
