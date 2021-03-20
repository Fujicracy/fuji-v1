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
//import Dialog from '@material-ui/core/Dialog';
//import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

function SupplyAndBorrowForm({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const [supplyAmount, setSupplyAmount] = useState(0);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [txConfirmation, setTxConfirmation] = useState(false);

  const ethBalance = useBalance(provider, address);

  //const collateralBalance = useContractReader(
    //contracts,
    //"VaultETHDAI",
    //"collaterals",
    //[address]
  //);

  const onSubmit = async() => {
    const res = await contracts
        .VaultETHDAI
        .withdraw(
          parseEther(supplyAmount)
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
          Supply & Borrow
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
            Balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} ETH Ξ
          </span>
        </div>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="supplyAmount"
            type="tel"
            id="supplyAmount"
            variant="outlined"
            onChange={({ target }) => setSupplyAmount(target.value)}
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
        {errors?.supplyAmount
            && <Typography variant="body2">
              Please, type the amount you like to supply!
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
            id="borrowAmount"
            name="borrowAmount"
            type="tel"
            variant="outlined"
            onChange={({ target }) => setBorrowAmount(target.value)}
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
        {errors?.borrowAmount
            && <Typography variant="body2">
              Please, type the amount you like to borrow!
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

export default SupplyAndBorrowForm;
