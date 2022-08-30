import * as ethereumCore from './vaults-core';
import * as ethereumFuse from './vaults-fuse';
import * as fantomCore from './vaults-fantom';
import * as polygonCore from './vaults-polygon';
import * as arbitrumCore from './vaults-arbitrum';
import * as optimismCore from './vaults-optimism';
import * as rinkebyCore from './vaults-rinkeby';

const BORROW_IDS = {
  ethereum: {
    core: ethereumCore.BORROW_IDS,
    fuse: ethereumFuse.BORROW_IDS,
  },
  fantom: {
    core: fantomCore.BORROW_IDS,
  },
  polygon: {
    core: polygonCore.BORROW_IDS,
  },
  arbitrum: {
    core: arbitrumCore.BORROW_IDS,
  },
  optimism: {
    core: optimismCore.BORROW_IDS,
  },
  rinkeby: {
    core: rinkebyCore.BORROW_IDS,
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
  polygon: {
    core: polygonCore.COLLATERAL_IDS,
  },
  arbitrum: {
    core: arbitrumCore.COLLATERAL_IDS,
  },
  optimism: {
    core: optimismCore.COLLATERAL_IDS,
  },
  rinkeby: {
    core: rinkebyCore.COLLATERAL_IDS,
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
  polygon: {
    core: polygonCore.VAULTS_NAMES,
  },
  arbitrum: {
    core: arbitrumCore.VAULTS_NAMES,
  },
  optimism: {
    core: optimismCore.VAULTS_NAMES,
  },
  rinkeby: {
    core: rinkebyCore.VAULTS_NAMES,
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
  polygon: {
    core: polygonCore.VAULTS,
  },
  arbitrum: {
    core: arbitrumCore.VAULTS,
  },
  optimism: {
    core: optimismCore.VAULTS,
  },
  rinkeby: {
    core: rinkebyCore.VAULTS,
  },
};

export { VAULTS_NAMES, BORROW_IDS, COLLATERAL_IDS, VAULTS };
