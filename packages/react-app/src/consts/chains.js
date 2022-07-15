import { ftmIcon, maticIcon, ethIcons, logoIcon } from 'assets/images';
import { capitalizeFirstLetter } from 'helpers/Utils';

const CHAIN_IDS = {
  ETHEREUM: 1,
  RINKEBY: 4,
  FANTOM: 250,
  POLYGON: 137,
  LOCAL: 31337,
};

const CHAIN_NAMES = {
  ETHEREUM: 'ethereum',
  RINKEBY: 'rinkeby',
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
    id: CHAIN_IDS.LOCAL,
    name: CHAIN_NAMES.LOCAL,
    title: capitalizeFirstLetter(CHAIN_NAMES.LOCAL),
    icon: logoIcon.toString(),
    isDeployed: false,
    isCustomNetwork: false,
    rpcUrl: 'http://localhost:8545',
  },
  [CHAIN_NAMES.RINKEBY]: {
    id: CHAIN_IDS.RINKEBY,
    name: CHAIN_NAMES.RINKEBY,
    title: capitalizeFirstLetter(CHAIN_NAMES.RINKEBY),
    icon: logoIcon.toString(),
    isDeployed: false,
    isCustomNetwork: false,
    rpcUrl: 'https://rinkeby.infura.io/v3',
  },
};

const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || CHAIN_NAMES.ETHEREUM;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 31337;
const CHAIN = CHAINS[CHAIN_NAME];

const EXPLORER_INFOS = {
  [CHAIN_IDS.ETHEREUM]: { url: 'https://etherscan.io/tx/', name: 'Etherscan' },
  [CHAIN_IDS.FANTOM]: { url: 'https://ftmscan.com/tx/', name: 'Ftmscan' },
  [CHAIN_IDS.POLYGON]: { url: 'https://polygonscan.com/tx/', name: 'Polygonscan' },
  [CHAIN_IDS.LOCAL]: { url: 'https://etherscan.io/tx/', name: 'Etherscan' },
};

export { CHAIN, CHAIN_ID, CHAIN_IDS, CHAIN_NAME, CHAIN_NAMES, CHAINS, EXPLORER_INFOS };
