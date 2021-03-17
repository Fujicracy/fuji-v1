import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatUnits, formatEther } from "@ethersproject/units";
import "./MyPositions.css";
import { useContractReader } from "./hooks";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
  })
);

function MyPositions({ contracts, address, setRoute }) {
  const classes = useStyles();
  const location = useLocation();

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

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

  return (
    <> 
      <Grid
        container
        direction="column"
        justify="center"
        className="positions"
        spacing={5}
      >
        <div class="title">My positions</div>
        <Grid item className="legend">
          <span class="empty-tab"></span>
          <div class="legend-elements">
            <span>Collateral</span>
            <span>Borrow</span>
            <span>Debt Ratio</span>
          </div>
          <span class="empty-button"></span>
        </Grid>
        <Grid item className="position-element">
          <div class="position-about">
            <div class="elmtXelmt">
              <img class="behind" src="/ETH.png" />
              <img class="front" src="https://assets.codepen.io/194136/dai.svg" />
            </div>
            <span class="elmt-name">ETH/DAI</span>
          </div>

          <div class="position-numbers">
            <div class="collateral-number">
              <span class="number">$ 15 234</span>
              <span class="additional-infos">
                <img src="/ETH.png" />
                <span>{
                  collateralBalance ? parseFloat(formatEther(collateralBalance)).toFixed(2) : ''
                  }</span>
              </span>
            </div>

            <div class="borrow-number">
              <span class="number">$ 15 234</span>
              <span class="additional-infos">
                <img src="https://assets.codepen.io/194136/dai.svg" />
                <span>{
                  debtBalance ? parseFloat(formatUnits(debtBalance)).toFixed(2) : ''
                  }</span>
              </span>
            </div>

            <div class="debt-ratio-number positive">
              <span class="number">85 %</span>
            </div>
          </div>

          <div class="position-actions">
            <button class="position-btn">Manage</button>
          </div>
        </Grid>
      </Grid>
    </>
   );
}

export default MyPositions;
