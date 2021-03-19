import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { formatUnits, formatEther } from "@ethersproject/units";
import "./MyPositions.css";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PositionElement, { PositionActions } from "./PositionElement";
import ProvidersList from "./ProvidersList";

function MyPositions({ contracts, address, setRoute }) {
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

  return (
    <div class="container">
      <div class="left-content">
        <div class="fuji-stats">
          <div class="dark-block">
            <span class="title">Fuji total borrows:</span>
            <span class="number">$ 1 239 223</span>
          </div>

          <div class="dark-block">
            <span class="title">Fuji all positions:</span>
            <span class="number">$ 1 239 223</span>
          </div>
        </div>
        <Grid
          container
          direction="column"
          justify="center"
          className="positions"
          spacing={5}
        >
          <Typography variant="h3">
            My positions
          </Typography>
          <div class="position-board">
            <Grid item className="legend">
              <span class="empty-tab"></span>
              <div class="legend-elements">
                <span>Collateral</span>
                <span>Debt</span>
                <span>Debt Ratio</span>
              </div>
              <span class="empty-button"></span>
            </Grid>
            <Grid item className="one-position">
              <PositionElement
                actionType={PositionActions.Manage}
                contracts={contracts}
                address={address}
              />
            </Grid>
          </div>
        </Grid>
      </div>
      <div class="right-content">
        <ProvidersList
          contracts={contracts}
        />
      </div>
    </div>
  );
}

export default MyPositions;
