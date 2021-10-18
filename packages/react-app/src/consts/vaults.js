import { DEPLOYMENT, DEPLOYMENT_TYPES, CHAIN_NAME, CHAIN_NAMES } from 'consts/globals';
import * as core from './vaults-core';
import * as fuse from './vaults-fuse';
import * as fantom from './vaults-fantom';

const BORROW_IDS =
  DEPLOYMENT === DEPLOYMENT_TYPES.CORE
    ? core.BORROW_IDS
    : DEPLOYMENT === DEPLOYMENT_TYPES.FUSE
    ? fuse.BORROW_IDS
    : fantom.BORROW_IDS;

const COLLATERAL_IDS =
  DEPLOYMENT === DEPLOYMENT_TYPES.CORE
    ? core.COLLATERAL_IDS
    : DEPLOYMENT === DEPLOYMENT_TYPES.FUSE
    ? fuse.COLLATERAL_IDS
    : fantom.COLLATERAL_IDS;

const VAULTS_ADDRESS =
  DEPLOYMENT === DEPLOYMENT_TYPES.CORE
    ? core.VAULTS_ADDRESS
    : DEPLOYMENT === DEPLOYMENT_TYPES.FUSE
    ? fuse.VAULTS_ADDRESS
    : fantom.VAULTS_ADDRESS;

const VAULTS =
  CHAIN_NAME === CHAIN_NAMES.ETHEREUM
    ? DEPLOYMENT === DEPLOYMENT_TYPES.CORE
      ? core.VAULTS
      : fuse.VAULTS
    : fantom.VAULTS;

console.log({ CHAIN_NAME, VAULTS });

export { VAULTS_ADDRESS, BORROW_IDS, COLLATERAL_IDS, VAULTS };
