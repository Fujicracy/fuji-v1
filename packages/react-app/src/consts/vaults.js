import { DEPLOYMENT } from 'consts/globals';
import * as core from './vaults-core';
import * as fuse from './vaults-fuse';

const VAULTS_ADDRESS = DEPLOYMENT === 'core' ? core.VAULTS_ADDRESS : fuse.VAULTS_ADDRESS;

const BORROW_IDS = DEPLOYMENT === 'core' ? core.BORROW_IDS : fuse.BORROW_IDS;

const COLLATERAL_IDS = DEPLOYMENT === 'core' ? core.COLLATERAL_IDS : fuse.COLLATERAL_IDS;

const VAULTS = DEPLOYMENT === 'core' ? core.VAULTS : fuse.VAULTS;

export { VAULTS_ADDRESS, BORROW_IDS, COLLATERAL_IDS, VAULTS };
