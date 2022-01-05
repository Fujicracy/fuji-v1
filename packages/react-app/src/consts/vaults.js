import * as ethereumCore from './vaults-core';
import * as ethereumFuse from './vaults-fuse';
import * as fantomCore from './vaults-fantom';

const BORROW_IDS = {
  ethereum: {
    core: ethereumCore.BORROW_IDS,
    fuse: ethereumFuse.BORROW_IDS,
  },
  fantom: {
    core: fantomCore.BORROW_IDS,
  },
};

const COLLATERAL_IDS = {
  ethereum: {
    core: ethereumCore.COLLATERAL_IDS,
    fuse: ethereumFuse.COLLATERAL_IDS,
  },
  fantom: {
    core: fantomCore.COLLATERAL_IDS,
  },
};

const VAULTS_NAMES = {
  ethereum: {
    core: ethereumCore.VAULTS_NAMES,
    fuse: ethereumFuse.VAULTS_NAMES,
  },
  fantom: {
    core: fantomCore.VAULTS_NAMES,
  },
};

const VAULTS = {
  ethereum: {
    core: ethereumCore.VAULTS,
    fuse: ethereumFuse.VAULTS,
  },
  fantom: {
    core: fantomCore.VAULTS,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
