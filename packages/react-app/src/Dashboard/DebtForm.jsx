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
import CircularProgress from '@material-ui/core/CircularProgress';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const Action = {
  Repay: 0,
  Borrow: 1
}

function DebtForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState(Action.Repay);
  const [focus, setFocus] = useState(false);
  const [amount, setAmount] = useState('');
  const [dialog, setDialog] = useState({ step: 0, withApproval: false });

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

  const borrow = async() => {
    setDialog({ step: 4, withApproval: false });
    const res = await tx(
      contracts
      .VaultETHDAI
      .borrow(
        parseUnits(amount)
      )
    );

    if (res && res.hash) {
      setDialog({ step: 0, withApproval: false });
      //setDialog({ step: 5, withApproval: false });
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Borrow')) {
        setDialog({ step: 6, withApproval: false });
        setAmount('');
      }
    }
    else {
      // error
      setDialog({ step: 0, withApproval: false });
    }
  }

  const payback = async(withApproval) => {
    setDialog({ step: 4, withApproval });
    const res = await tx(
      contracts
      .VaultETHDAI
      .payback(
        parseUnits(amount)
      )
    );

    if (res && res.hash) {
      setDialog({ step: 0, withApproval: false });
      //setDialog({ step: 5, withApproval });
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Repay')) {
        setDialog({ step: 6, withApproval });
        setAmount('');
      }
    }
    else {
      // error
      setDialog({ step: 0, withApproval: false });
    }
  }

  const approve = async(infiniteApproval) => {
    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval ? base.pow(e).sub(1) : parseUnits(amount);

    setDialog({ step: 0, withApproval: false });
    //setDialog({ step: 2, withApproval: true });
    const res = await tx(
      contracts
      .DAI
      .approve(
        contracts["VaultETHDAI"].address,
        BigNumber.from(approveAmount)
      )
    );

    if (res && res.hash) {
      //setDialog({ step: 3, withApproval: true });
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Approval')) {
        payback(true);
      }
    }
    else {
      // error
      console.log(res);
      setDialog({ step: 0, withApproval: false });
    }
  }

  const onSubmit = async (data) => {
    if (action === Action.Repay) {
      if (parseUnits(data.amount) > Number(allowance)) {
        setDialog({ step: 1, withApproval: true });
      }
      else {
        payback(false);
      }
    }
    else {
      borrow();
    }
  }

  const dialogContents = {
    '1': {
      title: 'Approving... 1 of 2',
      content: 'You need first to approve a spending limit.',
      loader: false,
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} className="main-button">
            Approve {amount} DAI
          </Button>
          <Button onClick={() => approve(true)} className="main-button">
            Infinite Approve
          </Button>
        </DialogActions>
      )
    },
    //'2': {
      //title: 'Approving... 1 of 2',
      //content: 'Please check your wallet: \n Transaction is waiting for confirmation!',
      //loader: true,
      //actions: () => null
    //},
    //'3': {
      //title:  'Approving... 1 of 2',
      //content: 'The transaction is pending, please wait!',
      //loader: true,
      //actions: () => null
    //},
    '4': {
      title: `${action === Action.Repay
          ? 'Repay' : 'Borrow'}ing... ${dialog.withApproval ? '2 of 2'
          : ''}`,
      content: 'Please check your wallet: \n Transaction is waiting for confirmation!',
      loader: true,
      actions: () => null
    },
    //'5': {
      //title: `${action === Action.Repay
          //? 'Repay' : 'Borrow'}ing... ${dialog.withApproval ? '2 of 2' :
          //''}`,
      //content: 'Transaction is pending, please wait!',
      //loader: true,
      //actions: () => null
    //},
    '6': {
      title: 'Transaction successful',
      content: `You have succefully ${action === Action.Repay ? 'repay' : 'borrow'}ed ${amount} DAI.`,
      loader: false,
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => setDialog({ step: 0, withApproval: false })}
            className="main-button"
          >
            Close
          </Button>
        </DialogActions>
      )
    },
  }

  return (
    <Grid container direction="column">
      <Dialog open={dialog.step !== 0} aria-labelledby="form-dialog-title">
        <div className="close" onClick={() => setDialog({ step: 0, withApproval: false })}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">
          {dialogContents[dialog.step]?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContents[dialog.step]?.content}
          </DialogContentText>
        </DialogContent>
        {dialogContents[dialog.step]?.loader
          ? <DialogContent>
            <CircularProgress />
          </DialogContent>
          : ""
        }
        {dialogContents[dialog.step]?.actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">
          Debt
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Keep your position safe.</span>
          </span>
        </div>
      </Grid>
      <Grid item className="toggle-button">
        <div className="button">
          <input
            onChange={({ target }) => setAction(target.checked ? Action.Borrow : Action.Repay)}
            type="checkbox"
            className="checkbox"
          />
          <div className="knobs">
            <span className="toggle-options" data-toggle="Borrow">
              <span>Repay</span>
            </span>
          </div>
          <div className="layer"></div>
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
            id="debtAmount"
            name="amount"
            type="number"
            variant="outlined"
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false || !!amount)}
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
        {errors?.amount && focus
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
          {action === Action.Repay ? 'Repay' : 'Borrow'}
        </Button>
      </Grid>
    </Grid>
  );
}

export default DebtForm;
