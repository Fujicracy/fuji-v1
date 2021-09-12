import { marketCoreIcon, marketFuseIcon } from 'assets/images';
import { DEPLOYMENT_TYPES } from './globals';

export const MARKETS = {
  [DEPLOYMENT_TYPES.CORE]: {
    id: DEPLOYMENT_TYPES.CORE,
    name: DEPLOYMENT_TYPES.CORE.toUpperCase(),
    icon: marketCoreIcon.toString(),
    dashboardUrl: process.env.REACT_APP_FUJI_DASHBOARD_URL || 'https://app.fujidao.org/#/dashboard',
  },
  [DEPLOYMENT_TYPES.FUSE]: {
    id: DEPLOYMENT_TYPES.FUSE,
    name: DEPLOYMENT_TYPES.FUSE.toUpperCase(),
    icon: marketFuseIcon.toString(),
    dashboardUrl:
      process.env.REACT_APP_FUSE_DASHBOARD_URL || 'https://fuse.fujidao.org/#/dashboard',
  },
};
