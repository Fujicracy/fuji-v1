import React, { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { useForm } from "react-hook-form";
import { useContractReader, useContractLoader, useCustomContractLoader } from "./hooks";
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

function DebtForm({ contracts, provider, address }) {
  const classes = useStyles();
  const theme = useTheme();
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState(0);
  const [amount, setAmount] = useState(1000);
  const [approveDialog, setApproveDialog] = useState(0);
  const [txStatus, setTxStatus] = useState(null);

  const debtBalance = useContractReader(
    contracts,
    "DebtToken",
    "balanceOf",
    [address]
  );

  const daiBalance = useContractReader(
    contracts,
    "DAI",
    "balanceOf",
    [address]
  );
  const allowance = useContractReader(
    contracts,
    "DAI",
    "allowance",
    [address, contracts ? contracts["VaultETHDAI"].address : '0x']
  );

  const payback = async() => {
    setApproveDialog(4);
    const res = await tx(
      contracts
      .VaultETHDAI
      .payback(
        parseUnits(amount)
      )
    );

    if (res && res.hash) {
      setApproveDialog(5);
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Repay')) {
        setApproveDialog(6);
      }
    }
    else {
      // error
      console.log(res);
      setApproveDialog(0);
    }
  }

  const approve = async(infiniteApproval) => {
    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval ? base.pow(e).sub(1) : parseUnits(amount);

    setApproveDialog(2);
    const res = await tx(
      contracts
      .DAI
      .approve(
        contracts["VaultETHDAI"].address,
        BigNumber.from(approveAmount)
      )
    );

    if (res && res.hash) {
      setApproveDialog(3);
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Approval')) {
        payback();
      }
    }
    else {
      // error
      console.log(res);
      setApproveDialog(0);
    }
  }

  const onSubmit = async (data) => {
    if (parseUnits(data.amount) > Number(allowance)) {
      setApproveDialog(1);
    }
    else {
      payback();
    }
  }

  const approvalSteps = {
    '1': {
      title: 'Approving... 1 of 2',
      content: 'You need first to approve a spending limit.',
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} color="primary">
            Approve {amount}
          </Button>
          <Button onClick={() => approve(true)} color="primary">
            Infinite Approve
          </Button>
        </DialogActions>
      )
    },
    '2': {
      title: 'Approving... 1 of 2',
      content: 'Please check your wallet: \n Transaction is waiting for confirmation!',
      actions: () => null
    },
    '3': {
      title:  'Approving... 1 of 2',
      content: 'The transaction is pending, please wait!',
      actions: () => null
    },
    '4': {
      title: `${action === 0 ? 'Repay' : 'Borrow'}ing... 2 of 2`,
      content: 'Please check your wallet: \n Transaction is waiting for confirmation!',
      actions: () => null
    },
    '5': {
      title: `${action === 0 ? 'Repay' : 'Borrow'}ing... 2 of 2`,
      content: 'Transaction is pending, please wait!',
      actions: () => null
    },
    '6': {
      title: 'Transaction successful',
      content: `You have succefully ${action === 0 ? 'repay' : 'borrowed'}ed ${amount} DAI`,
      actions: () => null
    },
  }

  return (
    <Grid container md={5} spacing={3} direction="column">
      <Dialog open={approveDialog !== 0} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{approvalSteps[approveDialog]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {approvalSteps[approveDialog]?.content}
          </DialogContentText>
        </DialogContent>
        {approvalSteps[approveDialog]?.actions()}
      </Dialog>
      <Grid item className={classes.rowSpaceBetween}>
        <Typography variant="h4" className={classes.blueTitle}>
          Debt:
        </Typography>
        <Typography variant="h4" className={classes.blueTitle}>
          {debtBalance
            ? parseFloat(formatUnits(debtBalance)).toFixed(2) + " DAI"
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
            label="Repay"
            className={classes.switchBtn}
            style={{ backgroundColor: action === 0
              ? theme.palette.success.main
              : "#fff"
            }}
          />
          <Tab
            label="Borrow"
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
            Amount to {action === 0 ? "repay" : "borrow"}
          </Typography>
          <Typography variant="body1">
            Wallet balance: {daiBalance ? formatUnits(daiBalance) : '...'}
          </Typography>
        </Box>
        <TextField
          className={classes.inputField}
          required
          fullWidth
          autoComplete="off"
          id="amount"
          name="amount"
          type="tel"
          variant="outlined"
          onChange={({ target }) => setAmount(target.value)}
          inputRef={register({ required: true, min: 0 })}
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
        {errors?.amount
            && <Typography variant="body2">
              Please, type the amount you like to repay!
            </Typography>
        }
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          className={classes.submitBtn}
        >
          {action === 0 ? "Repay" : "Borrow"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default DebtForm;
