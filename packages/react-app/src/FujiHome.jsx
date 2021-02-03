import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    mainBtn: {
      color: theme.palette.secondary.main,
      border: "5px solid" + theme.palette.primary.main,
      borderRadius: 50,
      boxSizing: "border-box",
      boxShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
      minWidth: "200px",
      margin: "5px",
      fontSize: "1.1em",
      fontWeight: "900",
      textTransform: "none",
    },
    mainArea: {
      position: "fixed",
      top: "35%"
    },
    baseLine: {
      fontWeight: "900",
    },
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
    </div>
   );
}

export default FujiHome;
