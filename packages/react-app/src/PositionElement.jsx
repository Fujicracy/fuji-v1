import React, { useState, useEffect } from "react";
import { useExchangePrice } from "./hooks";
import { useHistory } from 'react-router-dom';
import { formatUnits, formatEther } from "@ethersproject/units";
import Button from '@material-ui/core/Button';

export const PositionActions = {
  None: 0,
  Manage: 1,
  Liquidate: 2,
};

function PositionElement({ position, actionType }) {
  const history = useHistory();
  const price = useExchangePrice();

  const [ratio, setRatio] = useState('');

  const { debtBalance, collateralBalance, borrowAsset } = position;

  const decimals = borrowAsset === "USDC" ? 6 : 18;

  const debt = debtBalance ? Number(formatUnits(debtBalance, decimals)) : null;
  const collateral = collateralBalance ? Number(formatEther(collateralBalance)) : null;

  useEffect(() => {
    if (debt && collateral && price) {
      // collateralization and healthy factor
      const factor = 1.33;
      const r = debt / (collateral * price) * factor;
      setRatio(r);
    }
  }, [price, collateral, debt]);

  return (
    <div className="position-element">
      <div className="position-about">
        <div className="elmtXelmt">
          <img alt="eth" className="behind" src="/ETH.png" />
          <img className="front" alt={borrowAsset} src={`/${borrowAsset}.png`} />
        </div>
        <span className="elmt-name">ETH/{borrowAsset}</span>
      </div>

      <div className="position-numbers">
        <div className="collateral-number" data-element="Collateral">
          <span className="number">
            <img alt="eth" src="/ETH.png" />
            <span>{collateral ? collateral.toFixed(2) : "..."}</span>
          </span>
          <span className="additional-infos">
            ≈ ${collateral && price ? (collateral * price).toFixed(2) : "..."}
          </span>
        </div>

        <div className="borrow-number" data-element="Debt">
          <span className="number">
            <img alt={borrowAsset} src={`/${borrowAsset}.png`} />
            <span>{debt ? debt.toFixed(2) : "..."}</span>
          </span>
          <span className="additional-infos">≈ ${debt ? debt.toFixed(2) : "..."}</span>
        </div>

        <div className="debt-ratio-number positive" data-element="Debt ratio">
          <span className="number">{ratio ? Math.floor(ratio * 100) : "..."} %</span>
        </div>
      </div>

      <div className="position-actions">{
        actionType === PositionActions.Manage
          ? <Button
              className="position-btn"
              onClick={() => history.push(`/dashboard/position?borrowAsset=${borrowAsset}`)}
            >
              Manage
            </Button>
          : actionType === PositionActions.Liquidate
          ? <Button className="position-btn">Liquidate</Button>
          : <span style={{ width: "5rem" }}></span>
      }</div>
    </div>
  );
}

export default PositionElement;
