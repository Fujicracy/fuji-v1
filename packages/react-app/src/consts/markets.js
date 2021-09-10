import { marketCoreIcon, marketFuseIcon } from 'assets/images';

export const MARKET_NAMES = {
  CORE: 'CORE',
  FUSE: 'FUSE',
};

export const MARKETS = {
  [MARKET_NAMES.CORE]: {
    id: MARKET_NAMES.CORE.toLowerCase(),
    name: MARKET_NAMES.CORE,
    icon: marketCoreIcon.toString(),
  },
  [MARKET_NAMES.FUSE]: {
    id: MARKET_NAMES.FUSE.toLowerCase(),
    name: MARKET_NAMES.FUSE,
    icon: marketFuseIcon.toString(),
  },
};
