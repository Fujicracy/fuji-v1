const borrowAssets = {
  DAI: 1,
  USDC: 3,
};

export function getBorrowId(borrowAsset) {
  return borrowAssets[borrowAsset].toString();
}

const collateralsByBorrowAsset = {
  DAI: 0,
  USDC: 2,
};

export function getCollateralId(borrowAsset) {
  return collateralsByBorrowAsset[borrowAsset].toString();
}

const vaultsByBorrowAsset = {
  DAI: 'VaultETHDAI',
  USDC: 'VaultETHUSDC',
};

export function getVaultName(borrowAsset) {
  return vaultsByBorrowAsset[borrowAsset];
}
