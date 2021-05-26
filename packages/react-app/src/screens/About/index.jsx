import React from 'react';
import Container from '@material-ui/core/Container';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { boyanPhoto, daigaroPhoto, edgarPhoto, linkedinIcon } from '../../assets/images';
import Header from '../../components/Header';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      padding: theme.spacing(2, 0, 3),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      padding: theme.spacing(6, 0),
      textAlign: 'left',
      maxWidth: 720,
    },
    item: {
      textAlign: 'center',
      padding: theme.spacing(3, 1, 0, 2),
      marginBottom: theme.spacing(1),
    },
    title: {
      fontWeight: '900',
      fontSize: 36,
      paddingBottom: theme.spacing(3),
    },
    subtitle: {
      fontWeight: '900',
      fontSize: 24,
    },
    text: {
      paddingBottom: theme.spacing(4),
      fontStyle: 'normal',
      '& span': {
        fontWeight: '700',
        color: theme.palette.primary.main,
      },
    },
    telegram: {
      fontSize: 16,
      color: theme.palette.secondary.main,
    },
    meta: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

function Infos() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Header />
      <Grid container className={classes.section}>
        <Grid item md={12} className={classes.item}>
          <Typography className={classes.title}>Our Vision</Typography>
          <Typography variant="subtitle1" className={classes.text}>
            While FujiDAO is currently undergoing with initial updates and improvements by the core
            team, our long-term vision tend towards a real Decentralized Autonomous Organization,
            involving his community through governance mechanisms. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed metus magna.
          </Typography>
        </Grid>

        <Grid item md={12} className={classes.item}>
          <Typography className={classes.title}>Core Team</Typography>
        </Grid>

        <Grid item md={4} className={classes.item}>
          <img src={daigaroPhoto} alt="Daigaro" />

          <Typography className={classes.subtitle}>Daigaro Cota</Typography>

          <div className={classes.meta}>
            <Typography variant="h6">Role in here &nbsp;&nbsp;</Typography>
            <img src={linkedinIcon} alt="Daigaro Linkedin" />
          </div>

          <Typography className={classes.telegram}>@DaigaroC</Typography>
        </Grid>

        <Grid item md={4} className={classes.item}>
          <img src={boyanPhoto} alt="Boyan" />
        </Grid>
        <Grid item md={4} className={classes.item}>
          <img src={edgarPhoto} alt="Edgar" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Infos;
