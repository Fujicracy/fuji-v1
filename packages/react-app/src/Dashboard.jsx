import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader, useContractLoader } from "./hooks";
import { Transactor } from "./helpers";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";

import SideHelper from "./SideHelper";

const useStyles = makeStyles(theme => 
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      textAlign: "left",
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(7),
    },
    switchRow: {
      border: "5px solid" + theme.palette.primary.main,
      margin: "5px",
    },
    switchBtn: {
      fontSize: "1.1em",
      fontWeight: "900",
      textTransform: "none",
    },
    inputField: {
      padding: theme.spacing(0, 3),
      margin: "5px",
    },
    submitBtn: {
      padding: theme.spacing(1, 3),
      color: theme.palette.primary.main,
      fontSize: "1.2em",
      fontWeight: "900",
    },
    marginAdorn: {
      margin: theme.spacing(2),
    },
    collatInputText: {
      display: 'flex',
      justifyContent: 'space-between'
    },
  })
);

function Dashboard({ provider, address, setRoute }) {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const [collateralAction, setCollateralAction] = useState(0);
  const [borrowAction, setBorrowAction] = useState(0);
  const [borrowAmount, setBorrowAmount] = useState('1000');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [txConfirmation, setTxConfirmation] = useState(false);

  const ethBalance = useBalance(provider, address);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location, setRoute]);

  const contracts = useContractLoader(provider);
  const neededCollateral = useContractReader(
    contracts,
    "VaultETHDAI",
    "getNeededCollateralFor",
    [borrowAmount ? parseUnits(`${borrowAmount}`) : ''],
  );
  const aaveRate = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    ["0x6B175474E89094C44Da98b954EedeAC495271d0F"]
  );
  const compoundRate = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    ["0x6B175474E89094C44Da98b954EedeAC495271d0F"]
  );

  useEffect(() => {
    if (neededCollateral && collateralAmount >= formatUnits(neededCollateral)) {
      setDisableSubmit(false);
    }
    else {
      setDisableSubmit(true);
    }
  }, [collateralAmount, neededCollateral]);

  const tx = Transactor(provider);
  const handleSubmit = async () => {
    const res = await tx(
      contracts.VaultETHDAI.depositAndBorrow(
        parseEther(collateralAmount),
        parseUnits(borrowAmount),
        { value: parseEther(collateralAmount) }
      )
    );
    if (res && res.hash) {
      setTxConfirmation(true);
    }
    else {
      // error
    }
  }

  const handleCollateralAction = (event, action) => {
    console.log(action)
  }

  return (
    <div className={classes.paper}>
      <Grid
        container
        justify="space-around"
      >
        <Grid item md={11}>
          <Typography component="h1" variant="h4">
            Manage position
          </Typography>
        </Grid>{
        !txConfirmation
        ? <Grid item md={4}>
            <form className={classes.form} noValidate>
              <Grid container spacing={3} style={{ justifyContent: "center" }}>
                <Grid item xs={12}>
                  <Tabs
                    centered
                    onChange={(_, action) => setCollateralAction(action)}
                    variant="fullWidth"
                    className={classes.switchRow}
                  >
                    <Tab
                      label="Repay"
                      className={classes.switchBtn}
                      style={{ backgroundColor: collateralAction === 0
                          ? theme.palette.success.main
                          : "#fff"
                      }}
                    />
                    <Tab
                      label="Borrow"
                      className={classes.switchBtn}
                      style={{ backgroundColor: collateralAction === 1
                          ? theme.palette.success.main
                          : "#fff"
                      }}
                    />
                  </Tabs>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Amount to {collateralAction === 0 ? "repay" : "borrow"}
                  </Typography>
                  <TextField
                    className={classes.inputField}
                    required
                    fullWidth
                    placeholder="1000"
                    autoComplete="off"
                    id="borrowAmount"
                    name="borrowAmount"
                    type="tel"
                    variant="outlined"
                    onChange={({ target }) => setBorrowAmount(target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1" className={classes.marginAdorn}>
                            DAI
                          </Typography>
                          <Avatar alt="DAI" src="/DAI.png"/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleSubmit}
                    disabled={disableSubmit}
                    className={classes.submitBtn}
                  >
                    {collateralAction === 0 ? "Repay" : "Borrow"}
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ justifyContent: "center", marginTop: theme.spacing(7) }}>
                <Grid item xs={12}>
                  <Tabs
                    centered
                    onChange={(_, action) => setBorrowAction(action)}
                    variant="fullWidth"
                    className={classes.switchRow}
                  >
                    <Tab
                      label="Withdraw"
                      className={classes.switchBtn}
                      style={{ backgroundColor: borrowAction === 0
                          ? theme.palette.success.main
                          : "#fff"
                      }}
                    />
                    <Tab
                      label="Deposit"
                      className={classes.switchBtn}
                      style={{ backgroundColor: borrowAction === 1
                          ? theme.palette.success.main
                          : "#fff"
                      }}
                    />
                  </Tabs>
                </Grid>
                <Grid item xs={12}>
                  <Box className={classes.collatInputText}>
                    <Typography variant="body1">
                      Collateral to {borrowAction === 0 ? "withdraw" : "deposit"}
                    </Typography>
                    <Typography variant="body1">
                      Wallet balance: {ethBalance ? formatEther(ethBalance) : '...'}
                    </Typography>
                  </Box>
                  <TextField
                    className={classes.inputField}
                    required
                    fullWidth
                    autoComplete="off"
                    name="collateralAmount"
                    type="tel"
                    id="collateralAmount"
                    variant="outlined"
                    placeholder={
                      neededCollateral
                      ? "min " + parseFloat(formatUnits(neededCollateral)).toFixed(3)
                      : ""
                    }
                    onChange={({ target }) => setCollateralAmount(target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1" className={classes.marginAdorn}>
                            ETH
                          </Typography>
                          <Avatar alt="ETH" src="/ETH.png"/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleSubmit}
                    disabled={disableSubmit}
                    className={classes.submitBtn}
                  >
                    {borrowAction === 0 ? "Withdraw" : "Deposit"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        : ''
        }
        <Grid item md={4}>
          <SideHelper
            daiAmount={borrowAmount}
            ethAmount={collateralAmount}
            aaveRate={aaveRate}
            compoundRate={compoundRate}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
