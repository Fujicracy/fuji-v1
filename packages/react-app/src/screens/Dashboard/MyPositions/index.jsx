/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { useHistory } from 'react-router-dom';
import { formatUnits } from '@ethersproject/units';
import { Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useContractReader } from 'hooks';
import { ASSETS } from 'constants/assets';
import { getBorrowId, getCollateralId } from 'helpers';

import { PositionElement, PositionActions, ProvidersList, AlphaWarning } from 'components';

import './styles.css';

function MyPositions({ contracts, address }) {
  const history = useHistory();

  const positions = map(ASSETS, asset => ({
    debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      getBorrowId(asset.name),
    ]),
    collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      getCollateralId(asset.name),
    ]),
    borrowAsset: asset.name,
  }));

  const hasPosition = asset => {
    if (asset) {
      const position = filter(positions, item => item.name === asset);
      return position.collateralBalance && Number(formatUnits(position.collateralBalance)) > 0;
    }

    for (let i = 0; i < positions.length; i += 1) {
      if (
        positions[i].collateralBalance &&
        Number(formatUnits(positions[i].collateralBalance)) > 0
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
              positions,
              position =>
                hasPosition(position.borrowAsset) && (
                  <Grid item className="one-position">
                    <PositionElement
                      actionType={PositionActions.Manage}
                      position={position.borrowAsset}
                    />
                  </Grid>
                ),
            )}

            {map(
              positions,
              position =>
                !hasPosition(position.borrowAsset) &&
                position.collateralBalance !== undefined && (
                  <Grid
                    item
                    onClick={() =>
                      history.push(`/dashboard/init-borrow?borrowAsset=${position.borrowAsset}`)
                    }
                    className="adding-position"
                  >
                    <AddIcon />
                    Borrow {position.borrowAsset}
                  </Grid>
                ),
            )}
          </div>
        </Grid>
      </div>
      <div className="right-content">
        <AlphaWarning />
        <ProvidersList contracts={contracts} markets={['DAI', 'USDC', 'USDT']} />
      </div>
    </div>
  );
}

export default MyPositions;
