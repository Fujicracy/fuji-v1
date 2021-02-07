import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
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
  })
);

function FujiTeam({ address, setRoute, loadWeb3Modal }) {
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
      </Grid>

    </div>
   );
}

export default FujiTeam;
