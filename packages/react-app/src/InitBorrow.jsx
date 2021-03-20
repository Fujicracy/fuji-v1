import React, { useEffect, useState } from "react";
import "./InitBorrow.css";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader } from "./hooks";
//import { Transactor } from "./helpers";
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CollaterizationIndicator from "./CollaterizationIndicator";
import ProvidersList from "./ProvidersList";
import HowItWorks from "./HowItWorks";

// TODO rename to InitBorrow
// need to have a route params
// 1. defining the asset to borrow and the vault to be used
// 2. defining the amount to be borrowed

function InitBorrow({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();

  const [borrowAmount, setBorrowAmount] = useState(1000);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [formattedCollateral, setFormattedCollateral] = useState(0);
  const [txConfirmation, setTxConfirmation] = useState(false);

  const ethBalance = useBalance(provider, address);

  const neededCollateral = useContractReader(
    contracts,
    "VaultETHDAI",
    "getNeededCollateralFor",
    [borrowAmount ? parseUnits(`${borrowAmount}`) : ''],
  );

  useEffect(() => {
    if (neededCollateral) {
      const f = parseFloat(formatUnits(neededCollateral)).toFixed(3);
      setFormattedCollateral(f);
    }
  }, [neededCollateral]);

  //const tx = Transactor(provider);
  const onSubmit = async (data) => {
    const res = await contracts
        .VaultETHDAI
        .depositAndBorrow(
          parseEther(data.collateralAmount),
          parseUnits(data.borrowAmount),
          { value: parseEther(data.collateralAmount) }
        );

    if (res && res.hash) {
      setTxConfirmation(true);
    }
    else {
      // error
    }
  }

  return (
    <div className="container initial-step">
      <div className="left-content">
        <Dialog open={txConfirmation} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Success</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your transaction have been processed, you can now check your positions to follow the evolution of your debt position.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              href="/my-positions"
              className="main-button"
            >
              Check my positions
            </Button>
          </DialogActions>
        </Dialog>
        <HowItWorks />
        <div className="dark-block borrow-actions">
          <form noValidate>
            <div className="borrow-options">
              <div className="subtitle">Borrow</div>
              <div className="select-options">
                <div className="options-list">
                  <label>
                    <input type="radio" name="borrow" value="dai" checked />
                    <div className="fake-radio">
                      <img alt="dai" src="https://assets.codepen.io/194136/dai.svg" />
                      <span className="select-option-name">DAI</span>
                    </div>
                  </label>
                  <label>
                    <input type="radio" name="borrow" value="usdc" />
                    <div className="fake-radio">
                      <img alt="usdc" src="https://assets.codepen.io/194136/usdc.svg" />
                      <span className="select-option-name">USDC</span>
                    </div>
                  </label>
                  <label>
                    <input type="radio" name="borrow" value="usdt" />
                    <div className="fake-radio">
                      <img alt="usdt" src="https://assets.codepen.io/194136/tether.svg" />
                      <span className="select-option-name">USDT</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="borrow-inputs">
              <div className="borrow-amount-input">
                <div className="subtitle">
                  Amount to borrow
                </div>
                <div className="fake-input">
                  <TextField
                    className="input-container"
                    fullWidth
                    placeholder="1000"
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
              </div>
              <div className="collateral-input">
                <div className="subtitle">
                  Collateral
                  <span className="complementary-infos">
                    Wallet balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} Ξ
                  </span>
                </div>
                <div className="fake-input">
                  <TextField
                    className="input-container"
                    required
                    fullWidth
                    autoComplete="off"
                    name="collateralAmount"
                    type="tel"
                    id="collateralAmount"
                    variant="outlined"
                    placeholder={`min ${formattedCollateral}`}
                    onChange={({ target }) => setCollateralAmount(target.value)}
                    inputRef={register({ required: true, min: formattedCollateral})}
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
                {errors?.collateralAmount
                    && <Typography variant="body2">
                      Please, provide at least {formattedCollateral} ETH as collateral!
                    </Typography>
                }
              </div>
            </div>
            <div className="helper">
              <Typography variant="body2">
                You are saving <span>3758 DAI</span> by borrowing through FujiDAO. <br />
                That’s a nifty <span>13%</span> saved, compared to the lowest provider.
              </Typography>
            </div>
            <div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="main-button"
              >
                Borrow
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="right-content">
        <CollaterizationIndicator
          daiAmount={borrowAmount}
          ethAmount={collateralAmount}
        />
        <ProvidersList
          contracts={contracts}
        />
      </div>
    </div>
  );
}

export default InitBorrow;
