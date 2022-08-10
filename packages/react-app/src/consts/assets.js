import * as ethereum from './assets-ethereum';
import * as fantom from './assets-fantom';
import * as polygon from './assets-polygon';
import * as arbitrum from './assets-arbitrum';
import * as rinkeby from './assets-rinkeby';

const DEFAULT_BALANCE_ASSET = {
  ethereum: ethereum.ASSETS.ETH,
  fantom: fantom.ASSETS.FTM,
  polygon: polygon.ASSETS.MATIC,
  rinkeby: rinkeby.ASSETS.ETH,
  arbitrum: arbitrum.ASSETS.ETH,
};

const ASSETS = {
  ethereum: ethereum.ASSETS,
  fantom: fantom.ASSETS,
  polygon: polygon.ASSETS,
  rinkeby: rinkeby.ASSETS,
  arbitrum: arbitrum.ASSETS,
};

const ASSET_NAME = {
  ethereum: ethereum.ASSET_NAME,
  fantom: fantom.ASSET_NAME,
  polygon: polygon.ASSET_NAME,
  rinkeby: rinkeby.ASSET_NAME,
  arbitrum: arbitrum.ASSET_NAME,
};

export { ASSETS, ASSET_NAME, DEFAULT_BALANCE_ASSET };
