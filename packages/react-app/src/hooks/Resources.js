import { useMemo } from 'react';
import { useAuth } from 'hooks';
import { VAULTS, ASSETS, COLLATERAL_IDS, BORROW_IDS } from 'consts';

export default function useResources() {
  const { networkName, deployment } = useAuth();

  return useMemo(() => {
    const vaults = VAULTS[networkName][deployment];
    const assets = ASSETS[networkName];
    const collateralIds = COLLATERAL_IDS[networkName][deployment];
    const borrowIds = BORROW_IDS[networkName][deployment];
    return {
      vaults: Object.values(vaults),
      collateralIds: Object.values(collateralIds),
      borrowIds: Object.values(borrowIds),
      assets: Object.values(assets),
    };
  }, [networkName, deployment]);
}
