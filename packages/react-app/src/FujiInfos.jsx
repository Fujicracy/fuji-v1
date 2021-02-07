import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    container: {
      padding: theme.spacing(2, 0, 3),
    },
    section: {
      paddingTop: theme.spacing(3),
      textAlign: "left",
    },
    item: {
      padding: theme.spacing(3, 1, 0, 2),
      border: "5px solid" + theme.palette.primary.main,
      borderRadius: 50,
      boxSizing: "border-box",
      boxShadow: "inset 5px 5px 0px rgba(0, 0, 0, 0.25);",
    },
    title: {
      fontWeight: "900",
      color: theme.palette.primary.main,
      paddingBottom: theme.spacing(2),
    },
    text: {
      paddingBottom: theme.spacing(3),
      fontStyle: "normal",
      "& span": {
        fontWeight: "700",
        color: theme.palette.secondary.main,
      }
    },
    demoImg: {
      width: "100%",
      objectFit: "contain",
    },
  })
);

function FujiInfos({ address, setRoute, loadWeb3Modal }) {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

  return (
    <Container className={classes.container}> 
      <Grid
        container
        className={classes.section}
      >
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            What is Fuji Borrow
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            Fuji Borrow is a protocol that pools user funds together and continuously scouts multiple lending protocols  to provide its users with the lowest interest rate available.
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        className={classes.section}
      >
        <Grid item md={7}>
        </Grid>
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Why we are building it
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            In traditional financial markets, there are always opportunities to refinance debt and lower the borrowing interest rate of a loan. Think of how often people aggregate their multiple debts, for example, home mortgages, student loans, multiple credit cards all into one loan with a lower rate.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            We believe that DeFi requires similar refinancing opportunities, but renovated to the 2.0 level with the power of blockchain and smart contracts.
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.section}
      >
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            How it works
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            The protocol architecture includes the following elements:
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Vault</span> which handles user interaction and controls the assets.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Controller</span> which scouts the market and checks rates in available lending protocols.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            Standards for interactions, inspired by InstaDapp, from which each provider derives its own <span>Proxy</span> contract.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Debt token</span> contract, based on Aave's debt token standard, that tracks the individual users' debt positions.
          </Typography>
        </Grid>
        <Grid item md={1}>
        </Grid>
        <Grid item md={6}>
          <img
            className={classes.demoImg}
            src="/step1.png"
            title="Deposit-Borrow"
          />
        </Grid>
      </Grid>

      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.section}
      >
        <Grid item md={6}>
          <img
            className={classes.demoImg}
            src="/step2.png"
            title="Deposit-Borrow"
          />
        </Grid>
        <Grid item md={1}>
        </Grid>
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            How it works
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            The <span>Controller</span> has a routine to check and compare borrowing rates across the borrowing markets.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
             If conditions are met, it triggers a flashloan to repay the debt to the current provider, transfers the collateral, and finally opens the debt position with the new prpvider. 
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Flasher</span> contract executes flashloans and call logic from the Vault to swap collateral and borrowing positions from one lending protocol to another.
          </Typography>
        </Grid>
      </Grid>
    </Container>
   );
}

export default FujiInfos;
