import * as ethereumCore from './providers-ethereum-core.js';
import * as ethereumFuse from './providers-ethereum-fuse.js';
import * as fantomCore from './providers-fantom-core.js';

const PROVIDERS = {
  ethereum: {
    core: ethereumCore,
    fuse: ethereumFuse,
  },
  fantom: {
    core: fantomCore,
  },
};

export { PROVIDERS };
