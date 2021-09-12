import { DEPLOYMENT, DEPLOYMENT_TYPES } from './globals.js';
import * as core from './vaults-core.js';
import * as fuse from './vaults-fuse.js';

const VAULTS_ADDRESS =
  DEPLOYMENT === DEPLOYMENT_TYPES.CORE ? core.VAULTS_ADDRESS : fuse.VAULTS_ADDRESS;

const VAULTS = DEPLOYMENT === DEPLOYMENT_TYPES.CORE ? core.VAULTS : fuse.VAULTS;

export { VAULTS_ADDRESS, VAULTS };
