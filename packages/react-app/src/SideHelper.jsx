import React from "react";
import { useExchangePrice } from "./hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

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
    height: "90px",
    marginRight: theme.spacing(5),
    color: theme.palette.secondary.main,
    border: "5px solid" + theme.palette.primary.main,
    padding: theme.spacing(1, 4),
    borderRadius: 50,
    boxSizing: "border-box",
    boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25)",
  },
  currentlyUsing: {
    color: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
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
    boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25)",
  },
}));

function SideHelper({
  daiAmount,
  ethAmount,
  aaveRate,
  compoundRate,
  activeProvider
}) {
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
      spacing={6}
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
          <Typography component="span" variant="subtitle1" style={{ maxWidth: "350px" }}>
            This ratio represents the safety of your loan derived from the proportion of collateral versus amount borrowed. Keep it above 1 to avoid liquidation.
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Typography variant="h5">
          Providers
        </Typography>
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
            {activeProvider === "Aave"
              ? <Box className={classes.currentlyUsing}>
                  <ArrowBackIcon style={{ marginRight: "10px" }} />
                  <Typography component="span" variant="h5">
                    currently using
                  </Typography>
                </Box>
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
              {activeProvider === "Compound"
                ? <Box className={classes.currentlyUsing}>
                    <ArrowBackIcon style={{ marginRight: "10px" }} />
                    <Typography component="span" variant="h5">
                      currently using
                    </Typography>
                  </Box>
                : '' }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SideHelper;
