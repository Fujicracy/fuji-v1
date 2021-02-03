import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    vaultBtn: {
      color: theme.palette.secondary.main,
      border: "5px solid" + theme.palette.primary.main,
      padding: "8px 30px",
      borderRadius: 50,
      boxSizing: "border-box",
      boxShadow: "0px 10px 4px rgba(0, 0, 0, 0.25)",
      minWidth: "500px",
      margin: "5px",
      fontSize: "1.5em",
      fontWeight: "900",
      textTransform: "none",
      justifyContent: "space-between",
    },
  })
);

function FujiVaults({ address, setRoute }) {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

  return (
    <div style={{ paddingTop: "100px" }}> 
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.mainArea}
        spacing={5}
      >
        <Grid item>
          <Button
            className={classes.vaultBtn}
            endIcon={<ArrowForwardIosIcon />}
            href="./vaults/ethdai"
          >
            Borrow DAI
          </Button>
        </Grid>
        <Grid item>
          <Button
            disabled
            className={classes.vaultBtn}
          >
            Borrow USDC
          </Button>
        </Grid>
        <Grid item>
          <Button
            disabled
            className={classes.vaultBtn}
          >
            Borrow USDT
          </Button>
        </Grid>
      </Grid>
    </div>
   );
}

export default FujiVaults;
