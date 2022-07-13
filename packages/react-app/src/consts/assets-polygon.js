import { usdcIcon, daiIcon, ethIcons, btcIcon, maticIcon} from 'assets/images';

export const ASSET_NAME = {
  USDC: 'USDC',
  ETH: 'ETH',
  DAI: 'DAI',
  BTC: 'BTC',
  MATIC: 'MATIC'
};

export const ASSETS = {
  [ASSET_NAME.USDC]: {
    id: ASSET_NAME.USDC.toLowerCase(),
    name: ASSET_NAME.USDC,
    icon: usdcIcon.toString(),
    decimals: 6,
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    oracle: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
    isERC20: true,
  },
  [ASSET_NAME.DAI]: {
    id: ASSET_NAME.DAI.toLowerCase(),
    name: ASSET_NAME.DAI,
    icon: daiIcon.toString(),
    decimals: 18,
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    oracle: '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
    isERC20: true,
  },
  [ASSET_NAME.ETH]: {
    id: ASSET_NAME.ETH.toLowerCase(),
    name: ASSET_NAME.ETH,
    icon: ethIcons.BLUE.toString(),
    decimals: 18,
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    oracle: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
  },
  [ASSET_NAME.BTC]: {
    id: ASSET_NAME.BTC.toLowerCase(),
    name: ASSET_NAME.BTC,
    icon: btcIcon.toString(),
    decimals: 8,
    address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    oracle: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
  },
  [ASSET_NAME.MATIC]: {
    id: ASSET_NAME.MATIC.toLowerCase(),
    name: ASSET_NAME.MATIC,
    icon: maticIcon.toString(),
    decimals: 18,
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    oracle: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
  }
};
