import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./MyPositions.css";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PositionElement, { PositionActions } from "./PositionElement";
import ProvidersList from "./ProvidersList";

function MyPositions({ contracts, address, setRoute }) {
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location, setRoute])

  return (
    <div className="container">
      <div className="left-content">
        <div className="fuji-stats">
          <div className="dark-block">
            <span className="title">Fuji total borrows:</span>
            <span className="number">$ 1 239 223</span>
          </div>

          <div className="dark-block">
            <span className="title">Fuji all positions:</span>
            <span className="number">$ 1 239 223</span>
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
          <div className="position-board">
            <Grid item className="legend">
              <span className="empty-tab"></span>
              <div className="legend-elements">
                <span>Collateral</span>
                <span>Debt</span>
                <span>Debt Ratio</span>
              </div>
              <span className="empty-button"></span>
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
      <div className="right-content">
        <ProvidersList
          contracts={contracts}
        />
      </div>
    </div>
  );
}

export default MyPositions;
