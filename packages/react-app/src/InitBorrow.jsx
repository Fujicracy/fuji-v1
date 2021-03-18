import React, { useEffect, useState } from "react";
import "./InitBorrow.css";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader } from "./hooks";
import { Transactor } from "./helpers";
import { DAI_ADDRESS } from "./constants";
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import CollaterizationIndicator from "./CollaterizationIndicator";
import ProvidersList from "./ProvidersList";

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
  const activeProviderAddr = useContractReader(
    contracts,
    "VaultETHDAI",
    "activeProvider",
  );

  const aaveAddr = contracts && contracts["ProviderAave"]
    ? contracts["ProviderAave"].address
    : '';
  const aaveRate = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );

  //const compoundAddr = contracts && contracts["ProviderCompound"]
    //? contracts["ProviderCompound"].address
    //: '';
  const compoundRate = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
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
    <>
      <div class="left-content">
        <HowItWorks />
        <Grid container class="dark-block borrow-actions">
          <form noValidate>
            <div class="borrow-options">
              <div class="subtitle">Borrow</div>
              <div class="select-options">
                <div class="options-list">
                  <label>
                    <input type="radio" name="borrow" value="dai" checked="checked" />
                    <div class="fake-radio">
                      <img src="https://assets.codepen.io/194136/dai.svg" />
                      <span class="select-option-name">DAI</span>
                    </div>
                  </label>
                  <label>
                    <input type="radio" name="borrow" value="usdc" />
                    <div class="fake-radio">
                      <img src="https://assets.codepen.io/194136/usdc.svg" />
                      <span class="select-option-name">USDC</span>
                    </div>
                  </label>
                  <label>
                    <input type="radio" name="borrow" value="usdt" />
                    <div class="fake-radio">
                      <img src="https://assets.codepen.io/194136/tether.svg" />
                      <span class="select-option-name">USDT</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <Grid container class="borrow-inputs">
              <Grid item class="borrow-amount-input">
                <div class="subtitle">
                  Amount to borrow
                </div>
                <div class="fake-input">
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
                {errors?.borrowAmount
                    && <Typography variant="body2">
                      Please, type the amount you like to borrow!
                    </Typography>
                }
              </Grid>
              <Grid class="collateral-input">
                <div class="subtitle">
                  Collateral
                  <span class="complementary-infos">
                    Wallet balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} Ξ
                  </span>
                </div>
                <div class="fake-input">
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
                {errors?.collateralAmount
                    && <Typography variant="body2">
                      Please, provide at least {formattedCollateral} ETH as collateral!
                    </Typography>
                }
              </Grid>
            </Grid>
            <Grid item class="helper">
              <Typography variant="body2">
                You are saving <span>3758 DAI</span> by borrowing through FujiDAO. <br />
                That’s a nifty <span>13%</span> saved, compared to the lowest provider.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="main-button"
              >
                Borrow
              </Button>
            </Grid>
          </form>
        </Grid>
      </div>
      <div class="right-content">
        <CollaterizationIndicator
          daiAmount={borrowAmount}
          ethAmount={collateralAmount}
        />
        <ProvidersList
          aaveRate={aaveRate}
          compoundRate={compoundRate}
          activeProvider={activeProviderAddr === aaveAddr ? "Aave" : "Compound"}
        />
      </div>
    </>
  );
}

function HowItWorks() {
  return (
    <fieldset class="hiw">
      <legend class="hiw-title">
        <span class="hiw-title-content">
          <span class="icon">
            <InfoOutlinedIcon />
          </span>
          <Typography variant="h3">How it works</Typography>
        </span>
      </legend>

      <Typography variant="body2">
        Please enter the amount of <span class="bold">DAI</span> you'd like to borrow and the amount of
        <span class="bold">ETH</span> to provide as collateral.
        The minimum required amout of collateral is suggested.
      </Typography>
    </fieldset>
  );
}

export default InitBorrow;
