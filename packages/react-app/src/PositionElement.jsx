import React from "react";
import { useHistory } from 'react-router-dom';
import { formatUnits, formatEther } from "@ethersproject/units";
import { useContractReader } from "./hooks";
import Button from '@material-ui/core/Button';

export const PositionActions = {
  None: 0,
  Manage: 1,
  Liquidate: 2,
};

function PositionElement({ contracts, address, actionType }) {
  const history = useHistory();

  const debtBalance = useContractReader(
    contracts,
    "DebtToken",
    "balanceOf",
    [address]
  );
  const collateralBalance = useContractReader(
    contracts,
    "VaultETHDAI",
    "collaterals",
    [address]
  );
  //<span className="additional-infos">≈ $15 234</span>

  return (
    <div className="position-element">
      <div className="position-about">
        <div className="elmtXelmt">
          <img alt="eth" className="behind" src="/ETH.png" />
          <img alt="dai" className="front" src="/DAI.png" />
        </div>
        <span className="elmt-name">ETH/DAI</span>
      </div>

      <div className="position-numbers">
        <div className="collateral-number" data-element="Collateral">
          <span className="number">
            <img alt="eth" src="/ETH.png" />
            <span>{
              collateralBalance ? parseFloat(formatEther(collateralBalance)).toFixed(2) : ''
              }</span>
          </span>
        </div>

        <div className="borrow-number" data-element="Debt">
          <span className="number">
            <img alt="dai" src="/DAI.png" />
            <span>{
              debtBalance ? parseFloat(formatUnits(debtBalance)).toFixed(2) : ''
              }</span>
          </span>
        </div>

        <div className="debt-ratio-number positive" data-element="Debt ratio">
          <span className="number">85 %</span>
        </div>
      </div>

      <div className="position-actions">{
        actionType === PositionActions.Manage
          ? <Button className="position-btn" onClick={() => history.push('/dashboard/position')}>Manage</Button>
          : actionType === PositionActions.Liquidate
          ? <Button className="position-btn">Liquidate</Button>
          : <span style={{ width: "5rem" }}></span>
      }</div>
    </div>
  );
}

export default PositionElement;
