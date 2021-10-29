import * as ethereumCore from './vaults-ethereum-core.js';
import * as ethereumFuse from './vaults-ethereum-fuse.js';

const VAULTS = {
  ethereum: {
    core: ethereumCore,
    fuse: ethereumFuse,
  },
};

export { VAULTS };
