/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
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
      getBorrowId(asset.name), // 5 for usdt and 3 for usdc
    ]),
    collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      getCollateralId(asset.name),
    ]),
    borrowAsset: asset.name,
    decimals: asset.decimals,
  }));

  const hasPosition = asset => {
    let has = false;
    if (asset) {
      const position = find(positions, item => item.borrowAsset === asset);
      if (position.collateralBalance !== undefined) {
        has =
          position &&
          position.collateralBalance &&
          Number(formatUnits(position.collateralBalance, position.decimals)) > 0;
      }
    } else {
      for (let i = 0; i < positions.length; i += 1) {
        if (
          positions[i].collateralBalance &&
          Number(formatUnits(positions[i].collateralBalance, positions[i].decimals)) > 0
        ) {
          has = true;
        }
      }
    }

    return has;
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

            {map(positions, position =>
              hasPosition(position.borrowAsset) ? (
                <Grid key={position.borrowAsset} item className="one-position">
                  <PositionElement actionType={PositionActions.Manage} position={position} />
                </Grid>
              ) : (
                <Grid
                  key={position.borrowAsset}
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
