import React, { useEffect } from "react";
import "./MyPositions.css";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PositionElement, { PositionActions } from "../PositionElement";
import ProvidersList from "../ProvidersList";
import ProtocolStats from "../ProtocolStats";

function MyPositions({ contracts, address, }) {

  return (
    <div className="container">
      <div className="left-content">
        <Grid
          container
          direction="column"
          justify="center"
          className="positions"
        >
          <Typography variant="h3">
            My positions
          </Typography>
          <div className="position-board">
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
        <ProtocolStats />
        <ProvidersList
          contracts={contracts}
          markets={["DAI", "USDC"]}
        />
      </div>
    </div>
  );
}

export default MyPositions;
