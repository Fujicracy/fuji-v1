import {
  // btcIcon,
  // btcImage,
  ethNetworkIcon,
  bscNetworkIcon,
  maticNetworkIcon,
} from 'assets/images';

export const NETWORK_NAME = {
  ETH: 'ETH',
  MATIC: 'MATIC',
  BSC: 'BSC',
};

export const NETWORKS = {
  [NETWORK_NAME.ETH]: {
    id: NETWORK_NAME.ETH.toLowerCase(),
    name: NETWORK_NAME.ETH,
    icon: ethNetworkIcon.toString(),
  },
  [NETWORK_NAME.MATIC]: {
    id: NETWORK_NAME.MATIC.toLowerCase(),
    name: NETWORK_NAME.MATIC,
    icon: bscNetworkIcon.toString(),
  },
  [NETWORK_NAME.BSC]: {
    id: NETWORK_NAME.BSC.toLowerCase(),
    name: NETWORK_NAME.BSC,
    icon: maticNetworkIcon.toString(),
  },
};
