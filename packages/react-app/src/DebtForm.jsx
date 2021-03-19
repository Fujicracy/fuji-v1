import React, { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { useForm } from "react-hook-form";
import { useContractReader, useContractLoader, useCustomContractLoader } from "./hooks";
import { Transactor } from "./helpers";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DebtForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState('repay');
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
      title: `${action === 'repay' ? 'Repay' : 'Borrow'}ing... 2 of 2`,
      content: 'Please check your wallet: \n Transaction is waiting for confirmation!',
      actions: () => null
    },
    '5': {
      title: `${action === 'repay' ? 'Repay' : 'Borrow'}ing... 2 of 2`,
      content: 'Transaction is pending, please wait!',
      actions: () => null
    },
    '6': {
      title: 'Transaction successful',
      content: `You have succefully ${action}ed ${amount} DAI`,
      actions: () => null
    },
  }

  return (
    <Grid container direction="column">
      <Dialog open={approveDialog !== 0} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{approvalSteps[approveDialog]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {approvalSteps[approveDialog]?.content}
          </DialogContentText>
        </DialogContent>
        {approvalSteps[approveDialog]?.actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">
          Debt
        </Typography>
        <div class="tooltip-info">
          <InfoOutlinedIcon />
          <span class="tooltip tooltip-top">
            <span class="bold">Keep your position safe.</span>
          </span>
        </div>
      </Grid>
      <Grid item className="toggle-button">
        <div class="button">
          <input
            onChange={({ target }) => setAction(target.checked ? 'borrow' : 'repay')}
            type="checkbox"
            class="checkbox"
          />
          <div class="knobs">
            <span class="toggle-options" data-toggle="Borrow">
              <span>Repay</span>
            </span>
          </div>
          <div class="layer"></div>
        </div>
      </Grid>
      <Grid item>
        <div class="subtitle">
          Amount to {action}
          <span class="complementary-infos">
            DAI balance: {daiBalance ? formatUnits(daiBalance) : '...'} Ξ
          </span>
        </div>
        <div class="fake-input">
          <TextField
            className="input-container"
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
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="DAI" src="/DAI.png" class="icon"/>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" class="input-infos">
                    DAI
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.amount
            && <Typography variant="body2">
              Please, type the amount you like to repay!
            </Typography>
        }
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="main-button"
        >
          {action === 'repay' ? 'Repay' : 'Borrow'}
        </Button>
      </Grid>
    </Grid>
  );
}

export default DebtForm;
