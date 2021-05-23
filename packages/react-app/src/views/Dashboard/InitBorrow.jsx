import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./InitBorrow.css";
import { formatEther, parseEther, formatUnits, parseUnits } from "@ethersproject/units";
import { useBalance, useContractReader, useGasPrice } from "../../hooks";
import { Transactor, getBorrowId, getCollateralId, getVaultName, GasEstimator } from "../../helpers";
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
import CircularProgress from '@material-ui/core/CircularProgress';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { ETH_CAP_VALUE } from "../../constants";

import CollaterizationIndicator from "../../components/CollaterizationIndicator";
import ProvidersList from "../../components/ProvidersList";
import HowItWorks from "../../components/HowItWorks";
import AlphaWarning from "../../components/AlphaWarning";

function InitBorrow({ contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm();
  const queries = new URLSearchParams(useLocation().search);
  const gasPrice = useGasPrice();

  const [borrowAmount, setBorrowAmount] = useState('1000');
  const [borrowAsset, setBorrowAsset] = useState('DAI');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProvider = useContractReader(
    contracts,
    getVaultName(borrowAsset),
    "activeProvider",
  );

  const providerAave = contracts && contracts["ProviderAave"];
  const providerCompound = contracts && contracts["ProviderCompound"];
  // const providerDYDX = contracts && contracts["ProviderDYDX"];

  //const rates = useRates(contracts);

  //const calcSavedAmount = (amount) => {
    //if (!amount || amount === 0 || !providerAave)
      //return '...';

    //let rate;
    //if (activeProvider === providerAave.address) {
      //rate = rates.aave[borrowAsset.toLowerCase()];
    //} else if (activeProvider === providerCompound.address) {
      //rate = rates.compound[borrowAsset.toLowerCase()];
    //} else {
      //rate = rates.dydx[borrowAsset.toLowerCase()];
    //}

    //const interest = Number(amount) * Math.exp(rate / 100) - Number(amount);

    //return (0.1 * interest).toFixed(1);
  //}

  const _ethBalance = useBalance(provider, address);
  const ethBalance = _ethBalance ? Number(formatEther(_ethBalance)).toFixed(6) : null;
  const decimals = borrowAsset === "USDC" ? 6 : 18;

  const collateralBalance = useContractReader(
    contracts,
    "FujiERC1155",
    "balanceOf",
    [address, getCollateralId(borrowAsset)]
  );

  const debtBalance = useContractReader(
    contracts,
    "FujiERC1155",
    "balanceOf",
    [address, getBorrowId(borrowAsset)]
  );

  const _neededCollateral = useContractReader(
    contracts,
    getVaultName(borrowAsset),
    "getNeededCollateralFor",
    [borrowAmount ? parseUnits(borrowAmount, decimals) : '', "true"],
  );
  const neededCollateral = _neededCollateral ? Number(formatEther(_neededCollateral)) : null;

  const queryBorrowAmount = queries.get("borrowAmount");
  useEffect(() => {
    if (queryBorrowAmount) {
      setBorrowAmount(queryBorrowAmount);
    }
  }, [queryBorrowAmount, setBorrowAmount]);

  const queryBorrowAsset = queries.get("borrowAsset");
  useEffect(() => {
    if (queryBorrowAsset) {
      setBorrowAsset(queryBorrowAsset);
    }
  }, [queryBorrowAsset, setBorrowAsset]);

  const position = {
    borrowAsset,
    debtBalance: !debtBalance || !borrowAmount ? 0 : debtBalance.add(parseUnits(borrowAmount, decimals)),
    collateralBalance: !collateralBalance || !collateralAmount ? 0 : collateralBalance.add(parseEther(collateralAmount))
  };

  const tx = Transactor(provider);
  const onSubmit = async () => {
    const totalCollateral = Number(collateralAmount) + Number(formatUnits(collateralBalance));
    if (totalCollateral > ETH_CAP_VALUE) {
      setDialog('capCollateral');
      return;
    }

    setLoading(true);
    const gasLimit = await GasEstimator(
      contracts[getVaultName(borrowAsset)],
      'depositAndBorrow',
      [
        parseEther(collateralAmount),
        parseUnits(borrowAmount, decimals),
        { value: parseEther(collateralAmount), gasPrice }
      ]
    );
    const res = await tx(
      contracts[getVaultName(borrowAsset)]
      .depositAndBorrow(
        parseEther(collateralAmount),
        parseUnits(borrowAmount, decimals),
        { value: parseEther(collateralAmount), gasPrice, gasLimit }
      )
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === "Borrow")) {
        setDialog('success');
      }
    }
    setLoading(false);
  }
  //<label>
    //<input type="radio" name="borrow" value="usdt" disabled={true} />
    //<div className="fake-radio">
      //<img alt="usdt" src="/USDT.svg" />
      //<span className="select-option-name">USDT</span>
    //</div>
  //</label>

  const dialogContents = {
    'success': {
      title: 'Success',
      content: 'Your transaction has been processed, you can now check your position and follow the evolution of your debt position.',
      actions: () => (
        <DialogActions>
          <Button
            href="/dashboard/my-positions"
            className="main-button"
          >
            Check my positions
          </Button>
        </DialogActions>
      )
    },
    'capCollateral': {
      title: 'Collateral Cap',
      content: `The total amount of ETH you provide as collateral exceeds ${ETH_CAP_VALUE} ETH. This limit is set because the contracts are not audited yet and we want to cap the risk. Please, bear in mind that the alpha version is meant just to demonstrate the functioning of the protocol in real conditions. A fully fledged version will be available soon.`,
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog('');
            }}
            className="main-button"
          >
           Close
          </Button>
        </DialogActions>
      )
    }
  }

  return (
    <div className="container initial-step">
      <Dialog open={dialog === 'success' || dialog === 'capCollateral'} aria-labelledby="form-dialog-title">
        <div className="close" onClick={() => {
          setDialog('');
          setLoading(false);
        }}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">
          {dialogContents[dialog]?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContents[dialog]?.content}
          </DialogContentText>
        </DialogContent>
        {dialogContents[dialog]?.actions()}
      </Dialog>
      <div className="left-content">
        <HowItWorks />
        <div className="dark-block borrow-actions">
          <form noValidate>
            <div className="borrow-options">
              <div className="section-title">Borrow</div>
              <div className="select-options">
                <div className="options-list">
                  <label>
                    <input
                      type="radio"
                      name="borrow"
                      value="DAI"
                      onChange={({ target }) => setBorrowAsset('DAI')}
                      checked={borrowAsset === 'DAI'}
                    />
                    <div className="fake-radio">
                      <img alt="dai" src="/DAI.svg" />
                      <span className="select-option-name">DAI</span>
                    </div>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="borrow"
                      value="USDC"
                      onChange={({ target }) => setBorrowAsset('USDC')}
                      checked={borrowAsset === 'USDC'}
                    />
                    <div className="fake-radio">
                      <img alt="usdc" src="/USDC.svg" />
                      <span className="select-option-name">USDC</span>
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
                    placeholder={borrowAmount}
                    autoComplete="off"
                    id="borrowAmount"
                    name="borrowAmount"
                    type="number"
                    step="any"
                    variant="outlined"
                    value={borrowAmount}
                    onChange={({ target }) => setBorrowAmount(target.value)}
                    inputRef={register({ required: true, min: 0 })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Avatar alt={borrowAsset} src={`/${borrowAsset}.png`} className="icon"/>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1" className="input-infos">
                            {borrowAsset}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                {errors?.borrowAmount
                    && <Typography className="error-input-msg" variant="body2">
                          Please, type the amount you like to borrow
                      </Typography>
                }
              </div>
              <div className="collateral-input">
                <div className="subtitle">
                  Collateral
                  <span className="complementary-infos">
                    <span>Your balance: {ethBalance ? Number(ethBalance).toFixed(3) : '...'} Ξ</span>
                  </span>
                </div>
                <div className="fake-input">
                  <TextField
                    className="input-container"
                    required
                    fullWidth
                    autoComplete="off"
                    name="collateralAmount"
                    type="number"
                    step="any"
                    id="collateralAmount"
                    variant="outlined"
                    placeholder={`min ${neededCollateral ? neededCollateral.toFixed(3) : '...'}`}
                    onChange={({ target }) => setCollateralAmount(target.value)}
                    inputRef={
                      register({
                          required: { value: true, message: "required-amount" },
                          min: { value: neededCollateral, message: "insufficient-collateral" },
                          max: { value: ethBalance, message: "insufficient-balance" },
                      })
                    }
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
                {errors?.collateralAmount?.message === "required-amount"
                    && <Typography className="error-input-msg" variant="body2">
                        Please, type the amount you want to provide as collateral
                      </Typography>
                }
                {errors?.collateralAmount?.message === "insufficient-collateral"
                    && <Typography className="error-input-msg" variant="body2">
                          Please, provide at least <span className="brand-color">{neededCollateral.toFixed(3)} ETH</span> as collateral!
                      </Typography>
                }
                {errors?.collateralAmount?.message === "insufficient-balance"
                    && <Typography className="error-input-msg" variant="body2">
                        Insufficient ETH balance
                      </Typography>
                }
              </div>
            </div>
            <div className="helper">
              <Typography variant="body2">
                The liquidity for this transaction is coming from <span>{
                  !activeProvider
                    ? '...'
                    : activeProvider === providerAave.address
                      ? "Aave"
                      : activeProvider === providerCompound.address
                        ? "Compound"
                        : "dYdX"
                  }</span>.
              </Typography>
            </div>
            <div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="main-button"
                disabled={loading}
                startIcon={loading
                  ? <CircularProgress style={{ width: 25, height: 25, marginRight: "10px", color: "rgba(0, 0, 0, 0.26)" }} />
                  : ""}
              >
                Borrow{loading ? "ing..." : ""}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="right-content">
        <div style={{ marginBottom: "2rem" }}>
          <AlphaWarning/>
        </div>
        <CollaterizationIndicator
          position={position}
        />
        <ProvidersList
          contracts={contracts}
          markets={[borrowAsset]}
        />
      </div>
    </div>
  );
}

export default InitBorrow;
