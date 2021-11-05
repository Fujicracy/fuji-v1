import * as ethereumCore from './vaults-ethereum-core.js';
import * as ethereumFuse from './vaults-ethereum-fuse.js';
import * as fantomCore from './vaults-fantom-core.js';

const VAULTS = {
  ethereum: {
    core: ethereumCore,
    fuse: ethereumFuse,
  },
  fantom: {
    core: fantomCore,
  },
};

export { VAULTS };
