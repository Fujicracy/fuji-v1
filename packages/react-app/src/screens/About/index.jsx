import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  linkedinIcon,
  teamBoyanPhoto,
  teamDaigaroPhoto,
  teamEdgarPhoto,
  partnerDelphi,
  partnerCapital,
  partnerMaven,
  partnerSpartan,
} from '../../assets/images';
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
      marginBottom: theme.spacing(20),
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
      paddingBottom: theme.spacing(5),
      fontStyle: 'normal',
      '& span': {
        fontWeight: '700',
        color: theme.palette.primary.main,
      },
    },
    twitter: {
      fontSize: 16,
      color: '#FE014A',
      paddingBottom: theme.spacing(5),
    },
    meta: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    partner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: theme.spacing(2),
    },
    partnerImage: {
      maxWidth: '80%',
    },
  }),
);

function Infos() {
  const classes = useStyles();

  return (
    <>
      <Header />
      <Container className={classes.container}>
        <Grid container className={classes.section}>
          <Grid item md={12} className={classes.item}>
            <Typography className={classes.title}>Our Vision</Typography>
            <Typography variant="subtitle1" className={classes.text}>
              While FujiDAO is currently undergoing with initial updates and improvements by the
              core team, our long-term vision tend towards a real Decentralized Autonomous
              Organization, involving his community through governance mechanisms. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Sed metus magna.
            </Typography>
          </Grid>

          <Grid container className={classes.item}>
            <Grid item xs={12}>
              <Typography className={classes.title}>Core Team</Typography>
            </Grid>

            <Grid item xs={4}>
              <img src={teamDaigaroPhoto} alt="Daigaro Cota" />

              <Typography className={classes.subtitle}>Daigaro Cota</Typography>

              <div className={classes.meta}>
                <Typography variant="h6">Contracts Dev&nbsp;</Typography>
                <a
                  href="https://www.linkedin.com/in/daigaro-cota/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedinIcon} alt="Daigaro's Linkedin" />
                </a>
              </div>
              <a href="https://twitter.com/DaigaroC" target="_blank" rel="noreferrer">
                <Typography className={classes.twitter}>@DaigaroC</Typography>
              </a>
            </Grid>

            <Grid item xs={4}>
              <img src={teamBoyanPhoto} alt="Boyan Barakov" />

              <Typography className={classes.subtitle}>Boyan Barakov</Typography>

              <div className={classes.meta}>
                <Typography variant="h6">.sol hiker&nbsp;</Typography>
                <a
                  href="https://www.linkedin.com/in/boyan-barakov-3b91891a/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedinIcon} alt="Boyan's Linkedin" />
                </a>
              </div>

              <a href="https://twitter.com/BoyanBarakov" target="_blank" rel="noreferrer">
                <Typography className={classes.twitter}>@BoyanBarakov</Typography>
              </a>
            </Grid>

            <Grid item xs={4}>
              <img src={teamEdgarPhoto} alt="Edgar Moreau" />

              <Typography className={classes.subtitle}>Edgar Moreau</Typography>

              <div className={classes.meta}>
                <Typography variant="h6">DeFi Magician&nbsp;</Typography>
                <a
                  href="https://www.linkedin.com/in/edgar-moreau-1b074b133/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={linkedinIcon} alt="Edgar's Linkedin" />
                </a>
              </div>

              <a href="https://twitter.com/TheEdgarMoreau" target="_blank" rel="noreferrer">
                <Typography className={classes.twitter}>@TheEdgarMoreau</Typography>
              </a>
            </Grid>
          </Grid>

          <Grid container className={classes.item}>
            <Grid item md={12}>
              <Typography className={classes.title}>Partners</Typography>
            </Grid>

            <Grid item md={6} className={classes.partner}>
              <img
                src={partnerDelphi}
                className={classes.partnerImage}
                alt="Partner - Delphi Digital"
              />
            </Grid>
            <Grid item md={6} className={classes.partner}>
              <img
                src={partnerCapital}
                className={classes.partnerImage}
                alt="Partner - Origin Capital"
              />
            </Grid>
            <Grid item md={6} className={classes.partner}>
              <img src={partnerMaven} className={classes.partnerImage} alt="Partner - Maven 11" />
            </Grid>
            <Grid item md={6} className={classes.partner}>
              <img src={partnerSpartan} className={classes.partnerImage} alt="Partner - Spartan" />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Infos;
