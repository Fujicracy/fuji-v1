import {
  // btcIcon,
  // btcImage,
  ethIcons,
  maticIcons,
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
    icon: ethIcons.GRAY.toString(),
    isComingSoon: false,
  },
  [NETWORK_NAME.MATIC]: {
    id: NETWORK_NAME.MATIC.toLowerCase(),
    name: NETWORK_NAME.MATIC,
    icon: maticIcons.GRAY.toString(),
    isComingSoon: true,
  },
  // [NETWORK_NAME.BSC]: {
  //   id: NETWORK_NAME.BSC.toLowerCase(),
  //   name: NETWORK_NAME.BSC,
  //   icon: maticNetworkIcon.toString(),
  // },
};
