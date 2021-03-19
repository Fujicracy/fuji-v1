import React, { useEffect, useState } from "react";
import { formatEther, parseEther } from "@ethersproject/units";
import { useForm } from "react-hook-form";
import { useBalance, useContractReader } from "./hooks";
import { Transactor } from "./helpers";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

function CollateralForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [action, setAction] = useState('deposit');
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
    <Grid container direction="column">
      <Grid item className="section-title">
        <Typography variant="h3">
          Collateral
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
            onChange={({ target }) => setAction(target.checked ? 'withdraw' : 'deposit' )}
            type="checkbox"
            class="checkbox"
          />
          <div class="knobs">
            <span class="toggle-options" data-toggle="Withdraw">
              <span>Deposit</span>
            </span>
          </div>
          <div class="layer"></div>
        </div>
      </Grid>
      <Grid item>
        <div class="subtitle">
          Amount to {action}
          <span class="complementary-infos">
            ETH balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} Ξ
          </span>
        </div>
        <div class="fake-input">
          <TextField
            className="input-container"
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
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="ETH" src="/ETH.png" class="icon"/>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" class="input-infos">
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
          {action === 'withdraw' ? "Withdraw" : "Deposit"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default CollateralForm;
