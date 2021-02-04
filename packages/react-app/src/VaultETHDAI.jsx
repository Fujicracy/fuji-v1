import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader, useContractLoader, useExchangePrice } from "./hooks";
import { Transactor } from "./helpers";
import { JsonRpcProvider } from "@ethersproject/providers";
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      textAlign: "left",
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(12),
    },
    inputField: {
      padding: theme.spacing(0, 3),
      minWidth: "500px",
      margin: "5px",
    },
    submitBtn: {
      margin: theme.spacing(6, 0, 2),
      padding: theme.spacing(1, 3),
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.success.main,
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

function VaultETHDAI({ provider, address, setRoute }) {
  const classes = useStyles();
  const location = useLocation();

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

  return (
    <div className={classes.paper}>
      <Grid
        container
        justify="space-around"
      >
        <Grid item md={11}>
          <Typography component="h1" variant="h4">
            Borrow DAI
          </Typography>
        </Grid>{
        !txConfirmation
        ? <Grid item md={4}>
            <form className={classes.form} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    How it works
                  </Typography>
                  <Typography variant="subtitle1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Amount to borrow
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
                <Grid item xs={12}>
                  <Box className={classes.collatInputText}>
                    <Typography variant="body1">
                      Collateral
                    </Typography>
                    <Typography variant="body1">
                      Your balance: {ethBalance ? formatEther(ethBalance) : '...'}
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
              </Grid>
              <Grid item style={{ textAlign: "center" }}>
                <Button
                  onClick={handleSubmit}
                  disabled={disableSubmit}
                  className={classes.submitBtn}
                >
                  Borrow
                </Button>
              </Grid>
            </form>
          </Grid>
        : <Grid item md={4}>
            <BorrowConfirmation
              daiAmount={borrowAmount}
              ethAmount={collateralAmount}
              aaveRate={aaveRate}
              compoundRate={compoundRate}
            />
          </Grid>
        }
        <Grid item md={5}>
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

// ====== BorrowConfirmation =======

const useBorrowConfirmationStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(9, 3),
    color: theme.palette.secondary.main,
    border: "5px solid" + theme.palette.primary.main,
    padding: theme.spacing(1, 4),
    borderRadius: 50,
    boxSizing: "border-box",
    boxShadow: "15px 15px 4px rgba(0, 0, 0, 0.25)",
  },
  itemCheck: {
    flex: "auto",
    textAlign: "center",
  },
  containerDetails: {
    color: theme.palette.secondary.main,
    border: "5px solid" + theme.palette.primary.main,
    borderRadius: 50,
    boxSizing: "border-box",
    width: "100%",
    margin: theme.spacing(5, 0),
  },
  rowDetails: {
    display: "flex",
    justifyContent: "space-between",
    margin: theme.spacing(2, 4),
  },
  rowLastEl: {
    color: theme.palette.primary.main,
    fontWeight: 900,
  },
  submitBtn: {
    margin: theme.spacing(6, 0, 2),
    padding: theme.spacing(1, 3),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.success.main,
    fontSize: "1.2em",
    fontWeight: "900",
  }
}));

function BorrowConfirmation({ daiAmount, ethAmount, aaveRate, compoundRate }) {
  const classes = useBorrowConfirmationStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      className={classes.container}
      spacing={2}
    >
      <Grid item className={classes.itemCheck}>
        <DoneOutlineOutlinedIcon fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h4">
          Confirmed
        </Typography>
      </Grid>
      <Grid item className={classes.containerDetails}>
        <Box className={classes.rowDetails}>
          <Typography variant="h5">
            Borrowed:
          </Typography>
          <Typography variant="h5" className={classes.rowLastEl}>
            {daiAmount} DAI
          </Typography>
        </Box>
        <Box className={classes.rowDetails}>
          <Typography variant="h5">
            Deposited:
          </Typography>
          <Typography variant="h5" className={classes.rowLastEl}>
            {ethAmount} ETH
          </Typography>
        </Box>
        <Box className={classes.rowDetails}>
          <Typography variant="h5">
            Current provider:
          </Typography>
          <Typography variant="h5" className={classes.rowLastEl}>
            Aave
          </Typography>
        </Box>
      </Grid>
      <Grid item style={{ textAlign: "center" }}>
        <Button
          className={classes.submitBtn}
        >
          Manage my position
        </Button>
      </Grid>
    </Grid>
  );
}

// ====== SideHelper =======

const useSideHelperStyles = makeStyles(theme => ({
  statsRow: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(3, 0),
  },
  providerBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "222px",
    height: "100px",
    marginRight: theme.spacing(5),
    color: theme.palette.secondary.main,
    border: "5px solid" + theme.palette.primary.main,
    padding: theme.spacing(1, 4),
    borderRadius: 50,
    boxSizing: "border-box",
    boxShadow: "15px 15px 4px rgba(0, 0, 0, 0.25)",
  },
  collatRatioBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    minWidth: "200px",
    height: "200px",
    marginRight: theme.spacing(5),
    color: theme.palette.secondary.main,
    border: "5px solid",
    borderRadius: "50%",
    boxSizing: "border-box",
    boxShadow: "inset -14px 14px 4px rgba(0, 0, 0, 0.25)",
  },
}));

function SideHelper({ daiAmount, ethAmount, aaveRate, compoundRate }) {
  const classes = useSideHelperStyles();
  const mainnetProvider = new JsonRpcProvider(
    "https://mainnet.infura.io/v3/f8481a1ed3b0466ead585fdbd71d8f95"
  );
  const price = useExchangePrice(mainnetProvider);

  const ratio = ethAmount && daiAmount && price
    ? (ethAmount * price / daiAmount)
    : 0;

  const aaveR = parseFloat(`${aaveRate}`) / 1e27 * 100;
  const compoundR = parseFloat(`${compoundRate}`) / 1e27 * 100;

  return (
    <Grid
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Typography variant="h5">
          Collaterization Ratio
        </Typography>
        <Box className={classes.statsRow}>
          <Box
            className={classes.collatRatioBox}
            style={{ borderColor: ratio < 1.35 ? 'red' : 'blue' }}
          >
            <Typography component="p" variant="h4">
              {parseFloat(ratio).toFixed(2)}
            </Typography>
          </Box>
          <Typography component="span" variant="subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Typography variant="h5">
          Providers
        </Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          spacing={2}
        >
          <Grid item className={classes.statsRow}>
            <Box className={classes.providerBox}>
              <Avatar
                alt="Aave"
                src="/Aave.png"
              />
              <Typography component="p" variant="h5">
                {aaveR.toFixed(1)} %
              </Typography>
            </Box>
            {compoundR > aaveR
              ? (<>
                  <CheckCircleIcon style={{ marginRight: "5px" }} />
                  <Typography component="span" variant="subtitle1">
                    currently using
                  </Typography>
                </>)
              : '' }
          </Grid>
          <Grid item className={classes.statsRow}>
            <Box className={classes.providerBox}>
              <Avatar
                alt="Compound"
                src="/Compound.png"
              />
              <Typography component="p" variant="h5">
                {compoundR.toFixed(1)} %
              </Typography>
              </Box>
              {compoundR < aaveR
                ? (<>
                    <CheckCircleIcon style={{ marginRight: "5px" }} />
                    <Typography component="span" variant="subtitle1">
                      currently using
                    </Typography>
                  </>)
                : '' }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default VaultETHDAI;
