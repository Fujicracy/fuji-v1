import React, { useEffect, useState } from 'react';
import { formatEther, parseEther, formatUnits } from '@ethersproject/units';
import { useForm } from 'react-hook-form';
import {
  Button,
  CircularProgress,
  Typography,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Transactor, GasEstimator, getBorrowId, getCollateralId, getVaultName } from 'helpers';
import { useBalance, useContractReader, useGasPrice } from 'hooks';
import { ETH_CAP_VALUE } from 'constants/providers';
import { ASSETS } from 'constants/assets';
import DeltaPositionRatios from '../DeltaPositionRatios';

import { TextInput, Label } from '../../../components/UI';

const Action = {
  Supply: 0,
  Withdraw: 1,
};

function CollateralForm({
  borrowAsset,
  contracts,
  provider,
  address,
  collateralAssetName = 'ETH',
}) {
  const { register, errors, setValue, handleSubmit, clearErrors } = useForm({ mode: 'onChange' });
  const tx = Transactor(provider);
  const gasPrice = useGasPrice();

  const [action, setAction] = useState(Action.Supply);
  const [dialog, setDialog] = useState('');
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftCollateral, setLeftCollateral] = useState('');

  const unformattedEthBalance = useBalance(provider, address);
  const ethBalance = unformattedEthBalance
    ? Number(formatEther(unformattedEthBalance)).toFixed(6)
    : null;

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
      if (
        receipt &&
        receipt.events &&
        receipt.events.find(e => {
          return e.event === 'Deposit';
        })
      ) {
        setDialog('success');
      }
    }
    setLoading(false);
  };

  const withdraw = async () => {
    const unformattedAmount = Number(amount) === Number(leftCollateral) ? '-1' : amount;
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'withdraw', [
      parseEther(unformattedAmount),
      { gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].withdraw(parseEther(unformattedAmount), {
        gasPrice,
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (
        receipt &&
        receipt.events &&
        receipt.events.find(e => {
          return e.event === 'Withdraw';
        })
      ) {
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

  const handleClose = () => {
    setDialog('');
    setAmount('');
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
      actions: () => {
        return (
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
        );
      },
    },
    success: {
      title: 'Transactor successful',
      content: (
        <DialogContentText>
          You have successfully {action === Action.Withdraw ? 'withdrawn' : 'supplied'} {amount}{' '}
          ETH.
        </DialogContentText>
      ),
      actions: () => {
        return (
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
        );
      },
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
      actions: () => {
        return (
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
        );
      },
    },
  };

  return (
    <Grid container direction="column">
      <Dialog
        open={['dialog', 'capCollateral', 'deltaRatios'].includes(dialog)}
        aria-labelledby="form-dialog-title"
      >
        <div className="close" onClick={handleClose}>
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
            onChange={({ target }) => {
              return setAction(target.checked ? Action.Withdraw : Action.Supply);
            }}
            type="checkbox"
            className="checkbox"
          />
          <div className="knobs">
            <span className="toggle-options" data-toggle="Withdraw">
              <span>Supply</span>
            </span>
          </div>
          <div className="layer" />
        </div>
      </Grid>
      <Grid item>
        <TextInput
          step="any"
          id="collateralAmount"
          name="amount"
          type="number"
          onChange={({ target }) => {
            return setAmount(target.value);
          }}
          onFocus={() => {
            return setFocus(true);
          }}
          onBlur={() => {
            return clearErrors();
          }}
          ref={register({
            required: { value: true, message: 'insufficient-amount' },
            min: { value: 0, message: 'insufficient-amount' },
            max: {
              value: action === Action.Supply ? ethBalance : leftCollateral,
              message: 'insufficient-balance',
            },
          })}
          subTitle={action === Action.Supply ? 'Available to supply:' : 'Available to withdraw:'}
          subTitleInfo={
            action === Action.Supply
              ? `${ethBalance ? Number(ethBalance).toFixed(3) : '...'} ETH Ξ`
              : `${leftCollateral ? Number(leftCollateral).toFixed(3) : '...'} ETH Ξ`
          }
          startAdornmentImage={ASSETS[collateralAssetName].icon} // "/ETH.png"
          endAdornment={{
            type: 'component',
            component: (
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
                <Label>ETH</Label>
              </InputAdornment>
            ),
          }}
          errorComponent={
            errors?.amount?.message === 'insufficient-amount' ? (
              <Typography className="error-input-msg" variant="body2">
                Please, type an amount to {action === Action.Withdraw ? 'withdraw' : 'supply'}
              </Typography>
            ) : errors?.amount?.message === 'insufficient-balance' && action === Action.Supply ? (
              <Typography className="error-input-msg" variant="body2">
                Insufficient ETH balance
              </Typography>
            ) : (
              errors?.amount?.message === 'insufficient-balance' &&
              action === Action.Withdraw && (
                <Typography className="error-input-msg" variant="body2">
                  You can withdraw max. {leftCollateral} ETH
                </Typography>
              )
            )
          }
        />
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
