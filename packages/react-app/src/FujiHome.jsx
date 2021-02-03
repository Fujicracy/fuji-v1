import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    mainBtn: {
      minWidth: "200px",
      fontSize: "1.1em",
      fontWeight: "900",
    },
    mainArea: {
      position: "fixed",
      top: "35%"
    },
    baseLine: {
      fontWeight: "900",
    },
    footer: {
      position: "absolute",
      width: "100%",
      height: "80px",
      bottom: 0,
      left: 0,
      right: 0
    }
  })
);

function FujiHome({ address, setRoute, loadWeb3Modal }) {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

  return (
    <div> 
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.mainArea}
      >
        <Grid item md={6} style={{ paddingBottom: "50px" }}>
          <Typography variant="h4" className={classes.baseLine}>
            Fuji finds the best borrowing rates and automatically refinances your loan
          </Typography>
        </Grid>
        <Grid item>
        {
          !address
          ? <Button
              onClick={loadWeb3Modal}
              className={classes.mainBtn}
              size="large"
            >
              Connect Wallet
            </Button>
          : <Button
              href="vaults"
              className={classes.mainBtn}
              size="large"
            >
              Launch App
            </Button>
        }
        </Grid>
      </Grid>

      <div className={classes.footer}>
        <Button href="about" type="primary">
          FAQ
        </Button>

        <Button href="team" type="primary">
          Team
        </Button>
      </div>

      <div className={classes.footer}>
        <Button href="about" type="primary">
          FAQ
        </Button>

        <Button href="team" type="primary">
          Team
        </Button>
      </div>
    </div>
   );
}

export default FujiHome;
