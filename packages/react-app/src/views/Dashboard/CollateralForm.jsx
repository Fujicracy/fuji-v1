import React, { useEffect, useState } from 'react';
import { formatEther, parseEther, formatUnits } from '@ethersproject/units';
import { useForm } from 'react-hook-form';
import { useBalance, useContractReader, useGasPrice } from '../../hooks';
import {
  Transactor,
  GasEstimator,
  getBorrowId,
  getCollateralId,
  getVaultName,
} from '../../helpers';
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
import { ETH_CAP_VALUE } from '../../constants';
import DeltaPositionRatios from './DeltaPositionRatios';

const Action = {
  Supply: 0,
  Withdraw: 1,
};

function CollateralForm({ borrowAsset, contracts, provider, address }) {
  const { register, errors, setValue, handleSubmit, clearErrors } = useForm();
  const tx = Transactor(provider);
  const gasPrice = useGasPrice();

  const [action, setAction] = useState(Action.Supply);
  const [dialog, setDialog] = useState('');
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftCollateral, setLeftCollateral] = useState('');

  const _ethBalance = useBalance(provider, address);
  const ethBalance = _ethBalance ? Number(formatEther(_ethBalance)).toFixed(6) : null;

  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getBorrowId(borrowAsset),
  ]);
  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId(borrowAsset),
  ]);

  const neededCollateral = useContractReader(
    contracts,
    getVaultName(borrowAsset),
    'getNeededCollateralFor',
    [debtBalance ? debtBalance : '0', 'true'],
  );

  useEffect(() => {
    if (neededCollateral && collateralBalance) {
      const diff = formatEther(collateralBalance.sub(neededCollateral));
      // use toFixed to avoid scientific notation 2.1222e-6
      setLeftCollateral(Number(diff).toFixed(6));
    }
  }, [neededCollateral, collateralBalance]);

  const supply = async () => {
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'deposit', [
      parseEther(amount),
      { value: parseEther(amount), gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].deposit(parseEther(amount), {
        value: parseEther(amount),
        gasPrice,
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Deposit')) {
        setDialog('success');
      }
    }
    setLoading(false);
  };

  const withdraw = async () => {
    const _amount = Number(amount) === Number(leftCollateral) ? '-1' : amount;
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'withdraw', [
      parseEther(_amount),
      { gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].withdraw(parseEther(_amount), { gasPrice, gasLimit }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Withdraw')) {
        setDialog('success');
      }
    }
    setLoading(false);
  };

  const onSubmit = async () => {
    const totalCollateral = Number(amount) + Number(formatUnits(collateralBalance));
    if (action === Action.Supply && totalCollateral > ETH_CAP_VALUE) {
      setDialog('capCollateral');
      return;
    }

    setLoading(true);
    if (action === Action.Withdraw) {
      withdraw();
    } else {
      supply();
    }
  };

  const onConfirmation = () => {
    setDialog('deltaRatios');
  };

  const dialogContents = {
    deltaRatios: {
      title: 'Postion Ratio Changes',
      content: (
        <DeltaPositionRatios
          borrowAsset={borrowAsset}
          currentCollateral={collateralBalance}
          currentDebt={debtBalance}
          newDebt={debtBalance}
          newCollateral={
            !collateralBalance || !amount
              ? 0
              : action === Action.Withdraw
              ? collateralBalance.sub(parseEther(amount))
              : collateralBalance.add(parseEther(amount))
          }
        />
      ),
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog({ step: null, withApproval: false });
              onSubmit();
            }}
            className="main-button"
          >
            Confirm
          </Button>
        </DialogActions>
      ),
    },
    success: {
      title: 'Transactor successful',
      content: (
        <DialogContentText>
          You have successfully {action === Action.Withdraw ? 'withdrawn' : 'supplied'} {amount}{' '}
          ETH.
        </DialogContentText>
      ),
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog('');
              setAmount('');
              setValue('amount', '', { shouldValidate: false });
            }}
            className="main-button"
          >
            Close
          </Button>
        </DialogActions>
      ),
    },
    capCollateral: {
      title: 'Collateral Cap',
      content: (
        <DialogContentText>
          The total amount of ETH you provide as collateral exceeds {ETH_CAP_VALUE} ETH. This limit
          is set because the contracts are not audited yet and we want to cap the risk. Please, bear
          in mind that the alpha version is meant just to demonstrate the functioning of the
          protocol in real conditions. A fully fledged version will be available soon.
        </DialogContentText>
      ),
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
      ),
    },
  };

  return (
    <Grid container direction="column">
      <Dialog
        open={['dialog', 'capCollateral', 'deltaRatios'].includes(dialog)}
        aria-labelledby="form-dialog-title"
      >
        <div
          className="close"
          onClick={() => {
            setDialog('');
            setAmount('');
          }}
        >
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog]?.title}</DialogTitle>
        <DialogContent>{dialogContents[dialog]?.content}</DialogContent>
        {dialogContents[dialog]?.actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">Collateral</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Supply</span> more ETH as collateral or
            <span className="bold"> withdraw</span> what is not locked for your borrows.
          </span>
        </div>
      </Grid>
      <Grid item className="toggle-button">
        <div className="button">
          <input
            onChange={({ target }) => setAction(target.checked ? Action.Withdraw : Action.Supply)}
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
            {action === Action.Supply ? (
              <>
                <span>Available to supply:</span>
                <span>{ethBalance ? Number(ethBalance).toFixed(3) : '...'} ETH Ξ</span>
              </>
            ) : (
              <>
                <span>Available to withdraw:</span>
                <span>{leftCollateral ? Number(leftCollateral).toFixed(3) : '...'} ETH Ξ</span>
              </>
            )}
          </span>
        </div>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="amount"
            type="number"
            step="any"
            id="collateralAmount"
            variant="outlined"
            onChange={({ target }) => setAmount(target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => clearErrors()}
            inputRef={register({
              required: { value: true, message: 'insufficient-amount' },
              min: { value: 0, message: 'insufficient-amount' },
              max: {
                value: action === Action.Supply ? ethBalance : leftCollateral,
                message: 'insufficient-balance',
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="ETH" src="/ETH.png" className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {focus && (
                    <Button
                      className="max-button"
                      onClick={() => {
                        setAmount(action === Action.Supply ? ethBalance : leftCollateral);
                        setValue('amount', action === Action.Supply ? ethBalance : leftCollateral, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      max
                    </Button>
                  )}
                  <Typography variant="body1" className="input-infos">
                    ETH
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.amount?.message === 'insufficient-amount' && (
          <Typography className="error-input-msg" variant="body2">
            Please, type an amount to {action === Action.Withdraw ? 'withdraw' : 'supply'}
          </Typography>
        )}
        {errors?.amount?.message === 'insufficient-balance' && action === Action.Supply && (
          <Typography className="error-input-msg" variant="body2">
            Insufficient ETH balance
          </Typography>
        )}
        {errors?.amount?.message === 'insufficient-balance' && action === Action.Withdraw && (
          <Typography className="error-input-msg" variant="body2">
            You can withdraw max. {leftCollateral} ETH
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onConfirmation)}
          className="main-button"
          disabled={loading}
          startIcon={
            loading && (
              <CircularProgress
                style={{ width: 25, height: 25, marginRight: '10px', color: 'rgba(0, 0, 0, 0.26)' }}
              />
            )
          }
        >
          {action === Action.Withdraw ? 'Withdraw' : 'Supply'}
          {loading ? 'ing...' : ''}
        </Button>
      </Grid>
    </Grid>
  );
}

export default CollateralForm;
