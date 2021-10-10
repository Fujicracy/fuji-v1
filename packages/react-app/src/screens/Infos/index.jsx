import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { infoIcons } from 'assets/images';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      padding: theme.spacing(2, 0, 3),
    },
    section: {
      padding: theme.spacing(6, 0),
      textAlign: 'left',
    },
    item: {
      padding: theme.spacing(3, 1, 0, 2),
      marginBottom: theme.spacing(1),
      border: '5px solid' + theme.palette.primary.main,
      borderRadius: 50,
      boxSizing: 'border-box',
      boxShadow: 'inset 5px 5px 0px rgba(0, 0, 0, 0.25);',
    },
    title: {
      fontWeight: '900',
      color: theme.palette.secondary.main,
      paddingBottom: theme.spacing(2),
    },
    text: {
      paddingBottom: theme.spacing(3),
      fontStyle: 'normal',
      '& span': {
        fontWeight: '700',
        color: theme.palette.primary.main,
      },
    },
    demoImg: {
      width: '100%',
      objectFit: 'contain',
    },
  }),
);

function Infos() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container className={classes.section}>
        <Grid item md={4} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            What is Fuji Borrow
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            Fuji Borrow is a protocol that pools user funds together and continuously scouts
            multiple lending protocols to provide its users with the lowest interest rate available.
          </Typography>
        </Grid>
        <Grid item md={2} />
        <Grid item md={6} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Why we are building it
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            In traditional financial markets, there are always opportunities to refinance debt and
            lower the borrowing interest rate of a loan. Think of how often people aggregate their
            multiple debts, for example, home mortgages, student loans, multiple credit cards all
            into one loan with a lower rate.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            We believe that DeFi requires similar refinancing opportunities, but renovated to the
            2.0 level with the power of blockchain and smart contracts.
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" className={classes.section}>
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Protocol Architecture
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Vault</span> which handles user interaction and controls the assets.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Controller</span> which scouts the market and checks rates in available lending
            protocols.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            Standards for interactions, inspired by InstaDapp, from which each provider derives its
            own <span>Proxy</span> contract.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Debt token</span> contract, based on Aave&apos;s debt token standard, that
            tracks users&apos; debt positions.
          </Typography>
        </Grid>
        <Grid item md={1} />
        <Grid item md={6}>
          <img
            alt="architecture"
            className={classes.demoImg}
            src={infoIcons.step1}
            title="Protocol Architecture"
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" className={classes.section}>
        <Grid item md={6}>
          <img
            alt="flashloan"
            className={classes.demoImg}
            src={infoIcons.step2}
            title="Flashloan"
          />
        </Grid>
        <Grid item md={1} />
        <Grid item md={5} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            How it works
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            The <span>Controller</span> has a routine to check and compare borrowing rates across
            the borrowing markets.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            If conditions are met, it triggers a flashloan to repay the debt to the current
            provider, transfers the collateral, and finally opens the debt position with the new
            provider.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            A <span>Flasher</span> contract executes flashloans and call logic from the Vault to
            swap collateral and borrowing positions from one lending protocol to another.
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.section}>
        <Grid item md={7} className={classes.item}>
          <Typography variant="h5" className={classes.title}>
            Vision
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            Borrowing rate aggregators such as Fuji Borrow are needed as an essential block of DeFi.
          </Typography>
          <Typography variant="subtitle1" className={classes.text}>
            In the long term such applications will serve to the whole DeFi ecosystem by bringing
            equilibrium to the borrowing markets in DeFi.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Infos;
