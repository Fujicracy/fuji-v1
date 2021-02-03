import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
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
      fontSize: "1.3em",
      fontWeight: "900",
    },
    marginAdorn: {
      margin: theme.spacing(2),
    },
    statsRow: {
      display: "flex",
      alignItems: "center",
      margin: theme.spacing(3, 0),
    },
    providerBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
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
      width: "210px",
      height: "201px",
      marginRight: theme.spacing(5),
      color: theme.palette.secondary.main,
      border: "5px solid" + theme.palette.primary.main,
      borderRadius: "50%",
      boxSizing: "border-box",
      boxShadow: "inset -14px 14px 4px rgba(0, 0, 0, 0.25)",
    },
  })
);

function SideHelper() {
  const classes = useStyles();

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
          <Box className={classes.collatRatioBox}>
            <Typography component="p" variant="h4">
              125 %
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
                6 %
              </Typography>
            </Box>
            <Typography component="span" variant="subtitle1">
              currently using
            </Typography>
          </Grid>
          <Grid item className={classes.statsRow}>
            <Box className={classes.providerBox}>
              <Avatar
                alt="Compound"
                src="/Compound.png"
              />
              <Typography component="p" variant="h5">
                6 %
              </Typography>
            </Box>
            <Typography component="span" variant="subtitle1">
              currently using
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function VaultETHDAI({ address, setRoute }) {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

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
        </Grid>
        <Grid item md={4}>
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
                  id="borrowAmount"
                  name="borrowAmount"
                  type="number"
                  variant="outlined"
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
                <Typography variant="body1">
                  Collateral
                </Typography>
                <TextField
                  className={classes.inputField}
                  required
                  fullWidth
                  name="collateralAmount"
                  type="number"
                  id="collateralAmount"
                  variant="outlined"
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
                type="submit"
                className={classes.submitBtn}
              >
                Borrow
              </Button>
            </Grid>
          </form>
        </Grid>
        <Grid item md={5}>
          <SideHelper />
        </Grid>
      </Grid>
    </div>
  );
}

export default VaultETHDAI;
