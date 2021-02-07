import React, { useEffect } from "react";
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
      top: "30%"
    },
    baseLine: {
      fontWeight: "900",
      color: theme.palette.primary.main,
    },
    subtitle: {
      color: theme.palette.secondary.main,
      paddingBottom: theme.spacing(3),
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
          <Typography variant="h5" className={classes.subtitle}>
            The first DeFi borrowing aggregator
          </Typography>
          <Typography variant="h4" className={classes.baseLine}>
            Fuji finds the best borrowing rates and
            constantly refinances your loan
          </Typography>
        </Grid>
        <Grid item>
          <Button
            href="about"
            className={classes.mainBtn}
            size="large"
          >
            How it works
          </Button>
        </Grid>
      </Grid>

      <div className={classes.footer}>
        <Button href="team" type="primary">
          Team
        </Button>

        <Button href="https://twitter.com/FujiFinance" target="_blank" type="primary">
          Twitter
        </Button>

        <Button href="https://github.com/Fujicracy" target="_blank" type="primary">
          Github
        </Button>
      </div>
    </div>
   );
}

export default FujiHome;
        /*{
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
        }*/
