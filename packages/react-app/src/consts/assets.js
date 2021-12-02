import * as ethereum from './assets-ethereum';
import * as fantom from './assets-fantom';

const DEFAULT_BALANCE_ASSET = {
  ethereum: ethereum.ASSETS.ETH,
  fantom: fantom.ASSETS.FTM,
};

const ASSETS = {
  ethereum: ethereum.ASSETS,
  fantom: fantom.ASSETS,
};

const ASSET_NAME = {
  ethereum: ethereum.ASSET_NAME,
  fantom: fantom.ASSET_NAME,
};

export { ASSETS, ASSET_NAME, DEFAULT_BALANCE_ASSET };
