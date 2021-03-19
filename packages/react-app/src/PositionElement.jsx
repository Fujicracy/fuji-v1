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
    <div class="position-element">
      <div class="position-about">
        <div class="elmtXelmt">
          <img class="behind" src="/ETH.png" />
          <img class="front" src="https://assets.codepen.io/194136/dai.svg" />
        </div>
        <span class="elmt-name">ETH/DAI</span>
      </div>

      <div class="position-numbers">
        <div class="collateral-number">
          <span class="number">
            <img src="/ETH.png" />
            <span>{
              collateralBalance ? parseFloat(formatEther(collateralBalance)).toFixed(2) : ''
              }</span>
          </span>
          <span class="additional-infos">≈ $15 234</span>
        </div>

        <div class="borrow-number">
          <span class="number">
            <img src="https://assets.codepen.io/194136/dai.svg" />
            <span>{
              debtBalance ? parseFloat(formatUnits(debtBalance)).toFixed(2) : ''
              }</span>
          </span>
          <span class="additional-infos">≈ $15 234</span>
        </div>

        <div class="debt-ratio-number positive">
          <span class="number">85 %</span>
        </div>
      </div>

      <div class="position-actions">{
        actionType === PositionActions.Manage
          ? <Button class="position-btn">Manage</Button>
          : actionType === PositionActions.Liquidate
          ? <Button class="position-btn">Liquidate</Button>
          : <span style={{ width: "5rem" }}></span>
      }</div>
    </div>
  );
}

export default PositionElement;
