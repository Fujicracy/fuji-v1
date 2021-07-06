/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';
import { useHistory } from 'react-router-dom';
import { formatUnits } from '@ethersproject/units';
import { Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useContractReader } from 'hooks';
import { VAULTS } from 'constants/vaults';
// import { getBorrowId, getCollateralId } from 'helpers';

import { PositionElement, PositionActions, ProvidersList, AlphaWarning } from 'components';

import './styles.css';

function MyPositions({ contracts, address }) {
  const history = useHistory();
  const positions = map(Object.keys(VAULTS), key => {
    const vault = VAULTS[key];
    return {
      vaultAddress: key,
      debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        // getBorrowId(vault.borrowAsset.name), // 5 for usdt and 3 for usdc
        vault.borrowId,
      ]),
      collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        // getCollateralId(vault.borrowAsset.name),
        vault.collateralId,
      ]),
      // borrowAsset: vault.borrowAsset.name,
      // decimals: vault.borrowAsset.decimals,
      debtAsset: vault.borrowAsset,
      collateralAsset: vault.collateralAsset,
    };
  });

  const hasPosition = asset => {
    if (asset) {
      const position = find(positions, item => item.borrowAsset === asset);
      return (
        position &&
        position.collateralBalance &&
        Number(formatUnits(position.collateralBalance, position.debtAsset.decimals)) > 0
      );
    }
    for (let i = 0; i < positions.length; i += 1) {
      if (
        positions[i].collateralBalance &&
        Number(formatUnits(positions[i].collateralBalance, positions[i].debtAsset.decimals)) > 0
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="container">
      <div className="left-content">
        <Grid container direction="column" justify="center" className="positions">
          <Typography variant="h3">My positions</Typography>
          <div className="position-board">
            {hasPosition() ? (
              <Grid item className="legend">
                <span className="empty-tab" />
                <div className="legend-elements">
                  <span>Collateral</span>
                  <span>Debt</span>
                  <span>Health Factor</span>
                </div>
                <span className="empty-button" />
              </Grid>
            ) : (
              <div style={{ height: '2.5rem' }} />
            )}

            {map(
              orderBy(
                positions,
                item => Number(formatUnits(item.collateralBalance || 0, item.debtAsset.decimals)),
                'desc',
              ),
              position =>
                hasPosition(position.debtAsset.name) ? (
                  <Grid key={position.debtAsset.name} item className="one-position">
                    <PositionElement actionType={PositionActions.Manage} position={position} />
                  </Grid>
                ) : (
                  <Grid
                    key={position.debtAsset.name}
                    item
                    onClick={() =>
                      history.push(`/dashboard/init-borrow?borrowAsset=${position.debtAsset.name}`)
                    }
                    className="adding-position"
                  >
                    <AddIcon />
                    Borrow {position.debtAsset.name}
                  </Grid>
                ),
            )}
          </div>
        </Grid>
      </div>
      <div className="right-content">
        <AlphaWarning />
        <ProvidersList contracts={contracts} markets={['DAI', 'USDC', 'USDT']} />{' '}
        {/* TODO align-center in small width */}
      </div>
    </div>
  );
}

export default MyPositions;
