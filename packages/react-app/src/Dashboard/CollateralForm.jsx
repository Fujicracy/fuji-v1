import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "@ethersproject/units";
import { useForm } from "react-hook-form";
import { useBalance, useContractReader } from "../hooks";
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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const Action = {
  Supply: 0,
  Withdraw: 1
}

function CollateralForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState(Action.Supply);
  const [dialog, setDialog] = useState(false);
  const [focus, setFocus] = useState(false);
  const [amount, setAmount] = useState();

  const ethBalance = useBalance(provider, address);

  const collateralBalance = useContractReader(
    contracts,
    "VaultETHDAI",
    "collaterals",
    [address]
  );

  const supply = async () => {
    const res = await tx(
      contracts
      .VaultETHDAI
      .deposit(
        parseEther(amount),
        { value: parseEther(amount) }
      )
    );

    if (res && res.hash) {
      // success
      setDialog(true);
    }
  }

  const withdraw = async () => {
    const res = await tx(
      contracts
      .VaultETHDAI
      .withdraw(parseEther(amount))
    );

    if (res && res.hash) {
      // success
      setDialog(true);
    }
  }

  const onSubmit = async () => {
    if (action === Action.Withdraw) {
      withdraw();
    }
    else {
      supply();
    }
  }

  return (
    <Grid container direction="column">
      <Dialog open={dialog} aria-labelledby="form-dialog-title">
        <div className="close" onClick={() => setDialog(false)}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">
          Transaction successful
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have succefully {action === Action.Withdraw ? 'withdrawn' : 'supplied'} {amount} ETH.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialog(false)}
            className="main-button"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">
          Collateral
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
            onChange={({ target }) => setAction(target.checked ? Action.Withdraw : Action.Supply )}
            type="checkbox"
            className="checkbox"
          />
          <div className="knobs">
            <span className="toggle-options" data-toggle="Withdraw">
              <span>Supply</span>
            </span>
          </div>
          <div className="layer"></div>
        </div>
      </Grid>
      <Grid item>
        <div className="subtitle">
          <span className="complementary-infos">
            Balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} ETH Ξ
          </span>
        </div>
        <div className="fake-input">
          <TextField
            autoFocus
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="amount"
            type="tel"
            id="collateralAmount"
            variant="outlined"
            onChange={({ target }) => setAmount(target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false || !!amount)}
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
        {errors?.amount && focus
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
          {action === Action.Withdraw ? "Withdraw" : "Supply"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default CollateralForm;
