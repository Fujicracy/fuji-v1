import * as ethereum from './assets-ethereum.js';
import * as fantom from './assets-fantom.js';
import * as arbitrum from './assets-arbitrum.js';

const ASSETS = {
  ethereum: ethereum.ASSETS,
  fantom: fantom.ASSETS,
  arbitrum: arbitrum.ASSETS,
};

const ASSET_NAME = {
  ethereum: ethereum.ASSET_NAME,
  fantom: fantom.ASSET_NAME,
  arbitrum: arbitrum.ASSET_NAME,
};

export { ASSETS, ASSET_NAME };
