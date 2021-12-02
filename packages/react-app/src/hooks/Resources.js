import { useMemo } from 'react';
import { useAuth } from 'hooks';
import { VAULTS, ASSETS, COLLATERAL_IDS, BORROW_IDS } from 'consts';

export default function useResources() {
  const { networkName, deployment } = useAuth();

  return useMemo(() => {
    const assets = ASSETS[networkName];
    const vaults = VAULTS[networkName][deployment] ?? VAULTS[networkName].core;
    const collateralIds =
      COLLATERAL_IDS[networkName][deployment] ?? COLLATERAL_IDS[networkName].core;
    const borrowIds = BORROW_IDS[networkName][deployment] ?? BORROW_IDS[networkName].core;
    return {
      vaults: Object.values(vaults),
      collateralIds: Object.values(collateralIds),
      borrowIds: Object.values(borrowIds),
      assets: Object.values(assets),
    };
  }, [networkName, deployment]);
}
