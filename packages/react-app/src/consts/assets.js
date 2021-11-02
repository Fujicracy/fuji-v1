import { CHAIN_NAME, CHAIN_NAMES } from 'consts/globals';
import * as core from './assets-core';
import * as fantom from './assets-fantom';

const ASSET_NAME = CHAIN_NAME === CHAIN_NAMES.FANTOM ? fantom.ASSET_NAME : core.ASSET_NAME;

const ASSETS = CHAIN_NAME === CHAIN_NAMES.FANTOM ? fantom.ASSETS : core.ASSETS;

const DEFAULT_BALANCE_ASSET =
  CHAIN_NAME === CHAIN_NAMES.FANTOM ? fantom.ASSET_NAME.FTM : core.ASSET_NAME.ETH;

export { ASSETS, ASSET_NAME, DEFAULT_BALANCE_ASSET };
