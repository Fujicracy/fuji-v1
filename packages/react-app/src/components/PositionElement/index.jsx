import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatUnits, formatEther } from '@ethersproject/units';
import Button from '@material-ui/core/Button';

import { useExchangePrice } from '../../hooks';
import { PositionRatios } from '../../helpers';

export const PositionActions = {
  None: 0,
  Manage: 1,
  Liquidate: 2,
};

function hsl(r) {
  const hue = (r / 100) * 120;
  return `hsl(${Math.min(hue, 120)}, 100%, 50%)`;
}

function logslider(value) {
  if (value < 1) {
    return 0;
  }
  if (value >= 1 && value <= 2) {
    return 50 * value - 50;
  }
  const constant = 50 * Math.log10(2);
  return 100 - constant / Math.log10(value);
}

function PositionElement({ position, actionType }) {
  const { debtBalance, collateralBalance, borrowAsset } = position;
  const history = useHistory();
  const price = useExchangePrice();
  const borrowAssetPrice = useExchangePrice(borrowAsset.name);

  const [healthFactor, setHealthFactor] = useState(0);
  const [healthRatio, setHealthRatio] = useState(0);

  const debt = debtBalance ? Number(formatUnits(debtBalance, position.decimals)) : null;
  const collateral = collateralBalance ? Number(formatEther(collateralBalance)) : null;

  useEffect(() => {
    const ratios = PositionRatios(position, price);

    setHealthFactor(ratios.healthFactor);
    const hr = logslider(ratios.healthFactor);
    setHealthRatio(hr);
  }, [price, position]);

  return (
    <div className="position-element">
      <div className="position-about">
        <div className="elmtXelmt">
          <img alt="eth" className="behind" src="/ETH.png" />
          <img className="front" alt={borrowAsset.name} src={borrowAsset.icon} />
        </div>
        <span className="elmt-name">ETH/{borrowAsset.name}</span>
      </div>

      <div className="position-numbers">
        <div className="collateral-number" data-element="Collateral">
          <span className="number">
            <img alt="eth" src="/ETH.png" />
            <span>{collateral ? collateral.toFixed(2) : '...'}</span>
          </span>
          <span className="additional-infos">
            ≈ ${collateral && price ? (collateral * price).toFixed(2) : '...'}
          </span>
        </div>

        <div className="borrow-number" data-element="Debt">
          <span className="number">
            <img alt={borrowAsset.name} src={borrowAsset.icon} />
            <span>{debt ? debt.toFixed(2) : '...'}</span>
          </span>
          <span className="additional-infos">
            ≈ ${debt ? (debt * borrowAssetPrice).toFixed(2) : '...'}
          </span>
        </div>

        {(actionType === PositionActions.Manage || actionType === PositionActions.Liquidate) && (
          <div className="debt-ratio-number positive" data-element="Health Factor">
            <span className="number" style={{ color: hsl(healthRatio) }}>
              {healthFactor && healthFactor !== Infinity ? healthFactor.toFixed(2) : '..'}
            </span>
          </div>
        )}
      </div>

      <div className="position-actions">
        {actionType === PositionActions.Manage ? (
          <Button
            className="position-btn"
            onClick={() => {
              return history.push(`/dashboard/position?borrowAssetName=${borrowAsset.name}`);
            }}
          >
            Manage
          </Button>
        ) : actionType === PositionActions.Liquidate ? (
          <Button className="position-btn">Liquidate</Button>
        ) : (
          <span style={{ width: '5rem' }} />
        )}
      </div>
    </div>
  );
}

export default PositionElement;
