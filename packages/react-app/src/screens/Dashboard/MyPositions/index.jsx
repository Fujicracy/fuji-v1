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
import { VAULTS } from 'consts/vaults';

import { PositionElement, PositionActions, ProvidersList } from 'components';

import './styles.css';

function MyPositions({ contracts, address }) {
  const history = useHistory();
  const positions = map(Object.keys(VAULTS), key => {
    const vault = VAULTS[key];
    return {
      vaultAddress: key,
      debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        vault.borrowId,
      ]),
      collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        vault.collateralId,
      ]),
      borrowAsset: vault.borrowAsset,
      collateralAsset: vault.collateralAsset,
    };
  });

  const hasPosition = asset => {
    if (asset) {
      const position = find(positions, item => item.borrowAsset.name === asset);
      return (
        position &&
        position.collateralBalance &&
        Number(formatUnits(position.collateralBalance, position.borrowAsset.decimals)) > 0
      );
    }
    for (let i = 0; i < positions.length; i += 1) {
      if (
        positions[i].collateralBalance &&
        Number(formatUnits(positions[i].collateralBalance, positions[i].borrowAsset.decimals)) > 0
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
                item => Number(formatUnits(item.collateralBalance || 0, item.borrowAsset.decimals)),
                'desc',
              ),
              position =>
                hasPosition(position.borrowAsset.name) ? (
                  <Grid key={position.borrowAsset.name} item className="one-position">
                    <PositionElement actionType={PositionActions.Manage} position={position} />
                  </Grid>
                ) : (
                  <Grid
                    key={position.borrowAsset.name}
                    item
                    onClick={() =>
                      history.push(
                        `/dashboard/init-borrow?borrowAsset=${position.borrowAsset.name}`,
                      )
                    }
                    className="adding-position"
                  >
                    <AddIcon />
                    Borrow {position.borrowAsset.name}
                  </Grid>
                ),
            )}
          </div>
        </Grid>
      </div>
      <div className="right-content">
        <ProvidersList contracts={contracts} markets={['DAI', 'USDC', 'USDT']} />{' '}
        {/* TODO align-center in small width */}
      </div>
    </div>
  );
}

export default MyPositions;
