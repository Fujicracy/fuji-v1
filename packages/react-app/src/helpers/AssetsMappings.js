const borrowAssets = {
  DAI: 1,
  USDC: 3,
  USDT: 5,
};

export function getBorrowId(borrowAsset) {
  return borrowAssets[borrowAsset].toString();
}

const collateralsByBorrowAsset = {
  DAI: 0,
  USDC: 2,
  USDT: 4,
};

export function getCollateralId(borrowAsset) {
  return collateralsByBorrowAsset[borrowAsset].toString();
}

const vaultsByBorrowAsset = {
  DAI: 'VaultETHDAI',
  USDC: 'VaultETHUSDC',
  USDT: 'VaultETHUSDT',
};

export function getVaultName(borrowAsset) {
  return vaultsByBorrowAsset[borrowAsset];
}
