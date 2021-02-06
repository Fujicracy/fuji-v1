import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader, useContractLoader, useExternalContractLoader } from "./hooks";
import { Transactor } from "./helpers";
import { DAI_ADDRESS, DAI_ABI } from "./constants";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";

import SideHelper from "./SideHelper";

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
    rowSpaceBetween: {
      display: "flex",
      justifyContent: "space-between",
    },
    blueTitle: {
      fontWeight: "900",
      color: theme.palette.primary.main,
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
  })
);

function Dashboard({ provider, address, setRoute }) {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const [collateralAction, setCollateralAction] = useState(0);
  const [borrowAction, setBorrowAction] = useState(0);
  const [amount, setAmount] = useState('1000');
  const [collateral, setCollateral] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [txConfirmation, setTxConfirmation] = useState(false);

  const ethBalance = useBalance(provider, address);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location, setRoute]);

  const DAIContract = useExternalContractLoader(provider, DAI_ADDRESS, DAI_ABI);
  const daiBalance = useContractReader(
    { DAI: DAIContract },
    "DAI",
    "balanceOf",
    [address]
  );

  const contracts = useContractLoader(provider);
  //const neededCollateral = useContractReader(
    //contracts,
    //"VaultETHDAI",
    //"getNeededCollateralFor",
    //[amount ? parseUnits(`${amount}`) : ''],
  //);
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

  const compoundAddr = contracts && contracts["ProviderCompound"]
    ? contracts["ProviderCompound"].address
    : '';
  const compoundRate = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );

  //useEffect(() => {
    //if (neededCollateral && collateral >= formatUnits(neededCollateral)) {
      //setDisableSubmit(false);
    //}
    //else {
      //setDisableSubmit(true);
    //}
  //}, [collateral, neededCollateral]);

  const tx = Transactor(provider);
  const handleSubmit = async () => {
    const res = await tx(
      contracts.VaultETHDAI.depositAndBorrow(
        parseEther(collateral),
        parseUnits(amount),
        { value: parseEther(collateral) }
      )
    );
    if (res && res.hash) {
      setTxConfirmation(true);
    }
    else {
      // error
    }
  }

  //const handleCollateralAction = (event, action) => {
    //console.log(action)
  //}

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
          <SideHelper
            daiAmount={debtBalance}
            ethAmount={collateralBalance}
            aaveRate={aaveRate}
            compoundRate={compoundRate}
            activeProvider={activeProviderAddr === aaveAddr ? "Aave" : "Compound"}
          />
        </Grid>
        {
        !txConfirmation
        ? <Grid item md={12}>
            <form className={classes.form} noValidate>
              <Grid container md={5} spacing={3} direction="column">
                <Grid item className={classes.rowSpaceBetween}>
                  <Typography variant="h4" className={classes.blueTitle}>
                    Debt:
                  </Typography>
                  <Typography variant="h4" className={classes.blueTitle}>
                    {debtBalance
                      ? parseFloat(formatUnits(debtBalance)).toFixed(2) + " DAI"
                      : "loading..."
                    }
                  </Typography>
                </Grid>
                <Grid item>
                  <Tabs
                    value={false}
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
                <Grid item>
                  <Box className={classes.rowSpaceBetween}>
                    <Typography variant="body1">
                      Amount to {collateralAction === 0 ? "repay" : "borrow"}
                    </Typography>
                    <Typography variant="body1">
                      Wallet balance: {daiBalance ? formatUnits(daiBalance) : '...'}
                    </Typography>
                  </Box>
                  <TextField
                    className={classes.inputField}
                    required
                    fullWidth
                    autoComplete="off"
                    id="amount"
                    name="amount"
                    type="tel"
                    variant="outlined"
                    onChange={({ target }) => setAmount(target.value)}
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
              <Grid container md={5} spacing={3} direction="column">
                <Grid item className={classes.rowSpaceBetween}>
                  <Typography variant="h4" className={classes.blueTitle}>
                    Collateral:
                  </Typography>
                  <Typography variant="h4" className={classes.blueTitle}>
                    {collateralBalance
                      ? parseFloat(formatEther(collateralBalance)).toFixed(2) + " ETH"
                      : "loading..."
                    }
                  </Typography>
                </Grid>
                <Grid item>
                  <Tabs
                    value={false}
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
                <Grid item>
                  <Box className={classes.rowSpaceBetween}>
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
                    name="collateral"
                    type="tel"
                    id="collateral"
                    variant="outlined"
                    onChange={({ target }) => setCollateral(target.value)}
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
      </Grid>
    </div>
  );
}

export default Dashboard;
