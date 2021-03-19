import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useContractReader } from "./hooks";
import { DAI_ADDRESS } from "./constants";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";

import DebtForm from "./DebtForm";
import CollateralForm from "./CollateralForm";

const useStyles = makeStyles(theme => 
  createStyles({
    paper: {
      paddingTop: theme.spacing(2),
      textAlign: "left",
    },
    form: {
      display: "flex",
      justifyContent: "space-around",
      width: '100%', // Fix IE 11 issue.
      margin: theme.spacing(7, 0, 12),
    },
    blueTitle: {
      fontWeight: "900",
      color: theme.palette.primary.main,
    },
  })
);

function Dashboard({ contracts, provider, address, setRoute }) {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  }, [location, setRoute]);

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
  const activeProviderAddr = useContractReader(
    contracts,
    "VaultETHDAI",
    "activeProvider",
  );

  const aaveAddr = contracts && contracts["ProviderAave"]
    ? contracts["ProviderAave"].address
    : '';
  const aaveRate = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );

  //const compoundAddr = contracts && contracts["ProviderCompound"]
    //? contracts["ProviderCompound"].address
    //: '';
  const compoundRate = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );

  return (
    <div className={classes.paper}>
      <Grid
        container
        justify="space-around"
      >
        <Grid item md={11} style={{ paddingBottom: theme.spacing(4) }}>
          <Typography component="h1" variant="h3" className={classes.blueTitle}>
            Manage position
          </Typography>
        </Grid>
        <Grid item md={11}>
        </Grid>
        <Grid item md={12}>
          <form className={classes.form} noValidate>
            <DebtForm
              contracts={contracts}
              provider={provider}
              address={address}
            />
            <CollateralForm
              contracts={contracts}
              provider={provider}
              address={address}
            />
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
