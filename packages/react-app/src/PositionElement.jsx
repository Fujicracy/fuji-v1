import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatUnits, formatEther } from "@ethersproject/units";
import { useContractReader } from "./hooks";
import Button from '@material-ui/core/Button';

export const PositionActions = {
  None: 0,
  Manage: 1,
  Liquidate: 2,
};

function PositionElement({ contracts, address, actionType }) {

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

  return (
    <div className="position-element">
      <div className="position-about">
        <div className="elmtXelmt">
          <img className="behind" src="/ETH.png" />
          <img className="front" src="https://assets.codepen.io/194136/dai.svg" />
        </div>
        <span className="elmt-name">ETH/DAI</span>
      </div>

      <div className="position-numbers">
        <div className="collateral-number">
          <span className="number">
            <img src="/ETH.png" />
            <span>{
              collateralBalance ? parseFloat(formatEther(collateralBalance)).toFixed(2) : ''
              }</span>
          </span>
          <span className="additional-infos">≈ $15 234</span>
        </div>

        <div className="borrow-number">
          <span className="number">
            <img src="https://assets.codepen.io/194136/dai.svg" />
            <span>{
              debtBalance ? parseFloat(formatUnits(debtBalance)).toFixed(2) : ''
              }</span>
          </span>
          <span className="additional-infos">≈ $15 234</span>
        </div>

        <div className="debt-ratio-number positive">
          <span className="number">85 %</span>
        </div>
      </div>

      <div className="position-actions">{
        actionType === PositionActions.Manage
          ? <Button className="position-btn">Manage</Button>
          : actionType === PositionActions.Liquidate
          ? <Button className="position-btn">Liquidate</Button>
          : <span style={{ width: "5rem" }}></span>
      }</div>
    </div>
  );
}

export default PositionElement;
