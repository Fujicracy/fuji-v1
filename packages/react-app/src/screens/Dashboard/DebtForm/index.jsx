import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useForm } from 'react-hook-form';
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
import { ASSETS } from 'constants/assets';
import {
  Transactor,
  GasEstimator,
  getBorrowId,
  getCollateralId,
  getVaultName,
} from '../../../helpers';
import { useContractReader, useExchangePrice, useGasPrice } from '../../../hooks';

import DeltaPositionRatios from '../DeltaPositionRatios';

const Action = {
  Repay: 0,
  Borrow: 1,
};

function DebtForm({ borrowAsset, contracts, provider, address }) {
  const { register, errors, setValue, handleSubmit, clearErrors } = useForm();
  const price = useExchangePrice();
  const tx = Transactor(provider);
  const gasPrice = useGasPrice();

  const [action, setAction] = useState(Action.Repay);
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftToBorrow, setLeftToBorrow] = useState('');
  const [dialog, setDialog] = useState({ step: null, withApproval: false });

  const { decimals } = ASSETS.find(asset => asset.name === borrowAsset);

  const unFormattedBalance = useContractReader(contracts, borrowAsset, 'balanceOf', [address]);
  const balance = unFormattedBalance
    ? Number(formatUnits(unFormattedBalance, decimals)).toFixed(6)
    : null;
  const allowance = useContractReader(contracts, borrowAsset, 'allowance', [
    address,
    contracts ? contracts[getVaultName(borrowAsset)].address : '0x',
  ]);

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
    [debtBalance || '0', 'true'],
  );

  useEffect(() => {
    if (neededCollateral && collateralBalance) {
      const diff = Number(formatUnits(collateralBalance.sub(neededCollateral)));
      const left = (diff / 1.35) * price;
      setLeftToBorrow(left.toFixed(6));
    }
  }, [neededCollateral, collateralBalance, price]);

  const borrow = async () => {
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'borrow', [
      parseUnits(amount, decimals),
      { gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].borrow(parseUnits(amount, decimals), {
        gasPrice,
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Borrow')) {
        setDialog({ step: 'success', withApproval: false });
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
    }
    setLoading(false);
  };

  const payback = async withApproval => {
    setDialog({ step: 'repaying', withApproval });
    // if amount is equal debt, user repays their whole debt (-1)
    let unFormattedAmount = parseUnits(amount, decimals).eq(debtBalance) ? '-1' : amount;
    // another check when user wants to repay max
    // pass just the max amount of their balance and no -1
    // because they probably don't have to repay the accrued interest
    unFormattedAmount =
      unFormattedAmount === '-1' && debtBalance.eq(unFormattedBalance)
        ? formatUnits(unFormattedBalance, decimals)
        : unFormattedAmount;

    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'payback', [
      parseUnits(unFormattedAmount, decimals),
      { gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].payback(parseUnits(unFormattedAmount, decimals), {
        gasPrice,
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Repay')) {
        setDialog({ step: 'success', withApproval });
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
    }
    setLoading(false);
  };

  const approve = async infiniteApproval => {
    let unFormattedAmount = amount;
    // when repaying max debt, amount needs to be scaled by 2%
    // so that user approves a bit more in order to account for
    // the accrued interest
    // TODO add message to inform user
    if (parseUnits(amount, decimals).eq(debtBalance)) {
      unFormattedAmount = (Number(amount) * 1.02).toFixed(6);
    }

    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval
      ? base.pow(e).sub(1)
      : parseUnits(unFormattedAmount, decimals);
    setDialog({ step: 'approvalPending', withApproval: true });
    const res = await tx(
      contracts[borrowAsset].approve(
        contracts[getVaultName(borrowAsset)].address,
        BigNumber.from(approveAmount),
        { gasPrice: parseUnits('40', 'gwei') },
      ),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(ev => ev.event === 'Approval')) {
        payback(true);
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    if (action === Action.Repay) {
      if (parseUnits(amount, decimals).gt(allowance)) {
        setDialog({ step: 'approval', withApproval: true });
      } else {
        payback(false);
      }
    } else {
      borrow();
    }
  };

  const onConfirmation = () => {
    setDialog({ step: 'deltaRatios', withApproval: false });
  };

  const dialogContents = {
    deltaRatios: {
      title: 'Postion Ratio Changes',
      content: (
        <DeltaPositionRatios
          borrowAsset={borrowAsset}
          currentCollateral={collateralBalance}
          currentDebt={debtBalance}
          newCollateral={collateralBalance}
          newDebt={
            !debtBalance || !amount
              ? 0
              : action === Action.Repay
              ? debtBalance.sub(parseUnits(amount, decimals))
              : debtBalance.add(parseUnits(amount, decimals))
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
    approval: {
      title: 'Approving... 1 of 2',
      content: <DialogContentText>You need first to approve a spending limit.</DialogContentText>,
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} className="main-button">
            Approve {Number(amount).toFixed(0)} {borrowAsset}
          </Button>
          <Button onClick={() => approve(true)} className="main-button">
            Infinite Approve
          </Button>
        </DialogActions>
      ),
    },
    success: {
      title: 'Transaction successful',
      content: (
        <DialogContentText>
          You have successfully {action === Action.Repay ? 'repay' : 'borrow'}ed {amount}{' '}
          {borrowAsset}.
        </DialogContentText>
      ),
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog({ step: null, withApproval: false });
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
  };

  const getBtnContent = () => {
    if (action === Action.Repay) {
      if (!loading) {
        return 'Repay';
      }

      if (dialog.step === 'approvalPending') {
        return 'Approving... 1 of 2';
      }
      if (dialog.step === 'repaying') {
        return `Repaying... ${dialog.withApproval ? '2 of 2' : ''}`;
      }
    }

    return loading ? 'Borrowing...' : 'Borrow';
  };

  return (
    <Grid container direction="column">
      <Dialog
        open={['approval', 'success', 'deltaRatios'].includes(dialog.step)}
        aria-labelledby="form-dialog-title"
      >
        <div
          className="close"
          onClick={() => {
            setDialog({ step: null, withApproval: false });
            setValue('amount', '', { shouldValidate: false });
            setLoading(false);
          }}
        >
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog.step]?.title}</DialogTitle>
        <DialogContent>{dialogContents[dialog.step]?.content}</DialogContent>
        {dialogContents[dialog.step]?.actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">Debt</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Repay</span> {borrowAsset} from your wallet balance or
            <span className="bold"> borrow</span> more from it against your free collateral.
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
          <div className="layer" />
        </div>
      </Grid>
      <Grid item>
        <div className="subtitle">
          <span className="complementary-infos">
            {action === Action.Repay ? (
              <>
                <span>Available to repay:</span>
                <span>
                  {balance ? Number(balance).toFixed(2) : '...'} {borrowAsset} Ξ
                </span>
              </>
            ) : (
              <>
                <span>Available to borrow:</span>
                <span>
                  {leftToBorrow ? Number(leftToBorrow).toFixed(3) : '...'} {borrowAsset} Ξ
                </span>
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
            id="debtAmount"
            name="amount"
            type="number"
            step="any"
            variant="outlined"
            onChange={({ target }) => setAmount(target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => clearErrors()}
            inputRef={register({
              required: { value: true, message: 'insufficient-amount' },
              min: { value: 0, message: 'insufficient-amount' },
              max: {
                value: action === Action.Repay ? balance : leftToBorrow,
                message: 'insufficient-balance',
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt={borrowAsset} src={`/${borrowAsset}.png`} className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {focus && (
                    <Button
                      className="max-button"
                      onClick={() => {
                        const debt = formatUnits(debtBalance, decimals);
                        const maxRepay = Number(debt) > Number(balance) ? balance : debt;

                        setAmount(action === Action.Repay ? maxRepay : leftToBorrow);
                        setValue('amount', action === Action.Repay ? maxRepay : leftToBorrow, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    >
                      max
                    </Button>
                  )}
                  <Typography variant="body1" className="input-infos">
                    {borrowAsset}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.amount?.message === 'insufficient-amount' && (
          <Typography className="error-input-msg" variant="body2">
            Please, type the amount you like to {action === Action.Repay ? 'repay' : 'borrow'}
          </Typography>
        )}
        {errors?.amount?.message === 'insufficient-balance' && action === Action.Repay && (
          <Typography className="error-input-msg" variant="body2">
            Insufficient {borrowAsset} balance
          </Typography>
        )}
        {errors?.amount?.message === 'insufficient-balance' && action === Action.Borrow && (
          <Typography className="error-input-msg" variant="body2">
            You can borrow max. {leftToBorrow} {borrowAsset}. Provide more collateral!
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
          {getBtnContent()}
        </Button>
      </Grid>
    </Grid>
  );
}

export default DebtForm;
