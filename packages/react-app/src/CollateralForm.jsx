import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "@ethersproject/units";
import { useForm } from "react-hook-form";
import { useBalance, useContractReader } from "./hooks";
import { Transactor } from "./helpers";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => 
  createStyles({
    rowSpaceBetween: {
      display: "flex",
      justifyContent: "space-between",
    },
    blueTitle: {
      fontWeight: "900",
      color: theme.palette.primary.main,
    },
    switchRow: {
      border: "5px solid" + theme.palette.primary.main,
      margin: "5px",
    },
    switchBtn: {
      fontSize: "1.1em",
      fontWeight: "900",
      textTransform: "none",
    },
    inputField: {
      padding: theme.spacing(0, 3),
      margin: "5px",
    },
    submitBtn: {
      padding: theme.spacing(1, 3),
      color: theme.palette.primary.main,
      fontSize: "1.2em",
      fontWeight: "900",
    },
    marginAdorn: {
      margin: theme.spacing(2),
    },
  })
);

function CollateralForm({ contracts, provider, address }) {
  const classes = useStyles();
  const theme = useTheme();
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState(0);
  const [amount, setAmount] = useState(1000);
  const [txConfirmation, setTxConfirmation] = useState(false);

  const ethBalance = useBalance(provider, address);

  const collateralBalance = useContractReader(
    contracts,
    "VaultETHDAI",
    "collaterals",
    [address]
  );

  const onSubmit = async() => {
    const res = await contracts
        .VaultETHDAI
        .withdraw(
          parseEther(amount)
        );

    if (res && res.hash) {
      setTxConfirmation(true);
    }
    else {
      // error
    }
  }

  return (
    <Grid container md={5} spacing={3} direction="column">
      <Grid item className={classes.rowSpaceBetween}>
        <Typography variant="h4" className={classes.blueTitle}>
          Collateral:
        </Typography>
        <Typography variant="h4" className={classes.blueTitle}>
          {collateralBalance
            ? parseFloat(formatEther(collateralBalance)).toFixed(2) + " ETH"
            : "loading..."
          }
        </Typography>
      </Grid>
      <Grid item>
        <Tabs
          value={false}
          centered
          onChange={(_, action) => setAction(action)}
          variant="fullWidth"
          className={classes.switchRow}
        >
          <Tab
            label="Withdraw"
            className={classes.switchBtn}
            style={{ backgroundColor: action === 0
              ? theme.palette.success.main
              : "#fff"
            }}
          />
          <Tab
            label="Deposit"
            className={classes.switchBtn}
            style={{ backgroundColor: action === 1
              ? theme.palette.success.main
              : "#fff"
            }}
          />
        </Tabs>
      </Grid>
      <Grid item>
        <Box className={classes.rowSpaceBetween}>
          <Typography variant="body1">
            Collateral to {action === 0 ? "withdraw" : "deposit"}
          </Typography>
          <Typography variant="body1">
            Wallet balance: {ethBalance ? formatEther(ethBalance) : '...'}
          </Typography>
        </Box>
        <TextField
          className={classes.inputField}
          required
          fullWidth
          autoComplete="off"
          name="amount"
          type="tel"
          id="amount"
          variant="outlined"
          onChange={({ target }) => setAmount(target.value)}
          inputRef={register({ required: true, min: 0 })}
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
        {errors?.amount
            && <Typography variant="body2">
              Please, type the amount you like to withdraw!
            </Typography>
        }
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          className={classes.submitBtn}
        >
          {action === 0 ? "Withdraw" : "Deposit"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default CollateralForm;
