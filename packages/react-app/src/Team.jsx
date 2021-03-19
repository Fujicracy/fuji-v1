import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    mainArea: {
      position: "fixed",
      top: "30%"
    },
    card: {
      border: "5px solid" + theme.palette.primary.main,
      padding: theme.spacing(2, 0),
      borderRadius: 50,
      boxSizing: "border-box",
      boxShadow: "10px 15px 4px rgba(0, 0, 0, 0.25);",
    },
    pic: {
      height: theme.spacing(30),
      borderRadius: 70,
    },
    subtitle: {
      color: theme.palette.secondary.main,
      paddingTop: theme.spacing(2),
      fontWeight: "500",
    },
  })
);

function Team({ setRoute }) {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location, setRoute])

  return (
    <div> 
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={3}
        className={classes.mainArea}
      >
        <Grid item md={2}>
          <Link href="https://twitter.com/BoyanBarakov" target="_blank">
            <Card className={classes.card}>
              <CardMedia
                className={classes.pic}
                image="/BoyanB.jpg"
                title="Boyan Barakov"
              />
            </Card>
          </Link>
          <Typography variant="h5" className={classes.subtitle}>
            Boyan Barakov
          </Typography>
        </Grid>
        <Grid item md={2}>
          <Link href="https://twitter.com/DaigaroC" target="_blank">
            <Card className={classes.card}>
              <CardMedia
                className={classes.pic}
                image="/DaigaroC.jpg"
                title="Daigaro Cota"
              />
            </Card>
          </Link>
          <Typography variant="h5" className={classes.subtitle}>
            Daigaro Cota
          </Typography>
        </Grid>
        <Grid item md={2}>
          <Link href="https://twitter.com/TheEdgarMoreau" target="_blank">
            <Card className={classes.card}>
              <CardMedia
                className={classes.pic}
                image="/EdgarM.jpg"
                title="Edgar Moreau"
              />
            </Card>
          </Link>
          <Typography variant="h5" className={classes.subtitle}>
            Edgar Moreau
          </Typography>
        </Grid>
      </Grid>

    </div>
   );
}

export default Team;
