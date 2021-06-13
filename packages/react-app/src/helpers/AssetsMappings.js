const borrowAssets = {
  DAI: 1,
  USDC: 3,
  USDT: 3, // TODO: MARKUS - to be changed
};

export function getBorrowId(borrowAsset) {
  return borrowAssets[borrowAsset].toString();
}

const collateralsByBorrowAsset = {
  DAI: 0,
  USDC: 2,
  USDT: 2, // TODO: MARKUS - to be changed
};

export function getCollateralId(borrowAsset) {
  return collateralsByBorrowAsset[borrowAsset].toString();
}

const vaultsByBorrowAsset = {
  DAI: 'VaultETHDAI',
  USDC: 'VaultETHUSDC',
  USDT: 'VaultETHUSDC', // TODO: MARKUS - to be changed
};

export function getVaultName(borrowAsset) {
  return vaultsByBorrowAsset[borrowAsset];
}
