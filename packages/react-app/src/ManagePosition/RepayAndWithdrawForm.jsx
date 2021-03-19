import React, { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { useForm } from "react-hook-form";
import { useContractReader } from "../hooks";
import { Transactor } from "../helpers";
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

function RepayAndWithdrawForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState('repay');
  const [repayAmount, setRepayAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
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
        parseUnits(repayAmount)
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
    const approveAmount = infiniteApproval ? base.pow(e).sub(1) : parseUnits(repayAmount);

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
    if (parseUnits(data.repayAmount) > Number(allowance)) {
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
            Approve {repayAmount}
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
      content: `You have succefully ${action}ed ${repayAmount} DAI`,
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
          Repay & Withdraw
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Keep your position safe.</span>
          </span>
        </div>
      </Grid>
      <Grid item>
        <div className="subtitle">
          <span className="complementary-infos">
            Balance: {daiBalance ? formatUnits(daiBalance) : '...'} DAI Ξ
          </span>
        </div>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            id="repayAmount"
            name="repayAmount"
            type="tel"
            variant="outlined"
            onChange={({ target }) => setRepayAmount(target.value)}
            inputRef={register({ required: true, min: 0 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="DAI" src="/DAI.png" className="icon"/>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    DAI
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.repayAmount
            && <Typography variant="body2">
              Please, type the amount you like to repay!
            </Typography>
        }
      </Grid>
      <Grid item>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="withdrawAmount"
            type="tel"
            id="withdrawAmount"
            variant="outlined"
            onChange={({ target }) => setWithdrawAmount(target.value)}
            inputRef={register({ required: true, min: 0 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="ETH" src="/ETH.png" className="icon"/>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    ETH
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.amount
            && <Typography variant="body2">
              Please, type the amount you like to withdraw!
            </Typography>
        }
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="main-button"
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}

export default RepayAndWithdrawForm;
