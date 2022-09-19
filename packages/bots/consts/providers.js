import * as ethereumCore from './providers-ethereum-core.js';
import * as ethereumFuse from './providers-ethereum-fuse.js';
import * as fantomCore from './providers-fantom-core.js';
import * as arbitrumCore from './providers-arbitrum-core.js';

const PROVIDERS = {
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

export { PROVIDERS };
