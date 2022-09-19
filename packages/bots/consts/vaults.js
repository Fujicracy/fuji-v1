import * as ethereumCore from './vaults-ethereum-core.js';
import * as ethereumFuse from './vaults-ethereum-fuse.js';
import * as fantomCore from './vaults-fantom-core.js';
import * as arbitrumCore from './vaults-arbitrum-core.js';

const VAULTS = {
  ethereum: {
    core: ethereumCore,
    fuse: ethereumFuse,
  },
  fantom: {
    core: fantomCore,
  },
  arbitrum: {
    core: arbitrumCore,
  },
};

export { VAULTS };
