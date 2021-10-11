import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';
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
import { Transactor, GasEstimator, getAllowance } from 'helpers';
import { useBalance, useContractReader } from 'hooks';
import { ETH_CAP_VALUE } from 'consts/globals';
import { useMediaQuery } from 'react-responsive';
import { BigNumber } from '@ethersproject/bignumber';

import { VAULTS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import DeltaPositionRatios from '../DeltaPositionRatios';
import { TextInput, Label } from '../../../components/UI';
import { SectionTitle } from '../../../components/Blocks';

const Action = {
  Supply: 0,
  Withdraw: 1,
};

function CollateralForm({ position, contracts, provider, address }) {
  const { register, errors, setValue, handleSubmit, clearErrors } = useForm({ mode: 'onChange' });
  const tx = Transactor(provider);

  const [action, setAction] = useState(Action.Supply);
  const [dialog, setDialog] = useState('');
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftCollateral, setLeftCollateral] = useState('');
  const [allowance, setAllowance] = useState();

  const vault = VAULTS[position.vaultAddress];
  const unformattedUserBalance = useBalance(
    provider,
    address,
    contracts,
    vault.collateralAsset.name,
    vault.collateralAsset.isERC20,
  );

  const { vaultAddress, collateralAsset } = position;
  const userBalance = unformattedUserBalance
    ? Number(formatUnits(unformattedUserBalance, vault.collateralAsset.decimals)).toFixed(6)
    : null;

  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.borrowId,
  ]);
  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.collateralId,
  ]);

  const neededCollateral = useContractReader(contracts, vault.name, 'getNeededCollateralFor', [
    debtBalance || '0',
    'true',
  ]);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => {
    async function fetchAllowance() {
      setAllowance(await getAllowance(contracts, collateralAsset.name, [address, vaultAddress]));
    }

    fetchAllowance();
  }, [collateralAsset, address, contracts, vaultAddress]);

  useEffect(() => {
    if (neededCollateral && collateralBalance) {
      const diff = formatUnits(
        collateralBalance.sub(neededCollateral),
        vault.collateralAsset.decimals,
      );
      // use toFixed to avoid scientific notation 2.1222e-6
      setLeftCollateral(Number(diff).toFixed(6));
    }
  }, [neededCollateral, collateralBalance, vault.collateralAsset.decimals]);

  const supply = async withApproval => {
    setDialog({ step: 'doing', withApproval });

    const parsedAmount = parseUnits(amount, vault.collateralAsset.decimals);
    const gasLimit = await GasEstimator(contracts[vault.name], 'deposit', [
      parsedAmount,
      { value: collateralAsset.isERC20 ? 0 : parsedAmount },
    ]);
    const res = await tx(
      contracts[vault.name].deposit(parsedAmount, {
        value: collateralAsset.isERC20 ? 0 : parsedAmount,
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
        setDialog({ step: 'success' });
      }
    }
    setLoading(false);
  };

  const withdraw = async withApproval => {
    setDialog({ step: 'doing', withApproval });

    const unformattedAmount = Number(amount) === Number(leftCollateral) ? '-1' : amount;
    const gasLimit = await GasEstimator(contracts[vault.name], 'withdraw', [
      parseUnits(unformattedAmount, vault.collateralAsset.decimals),
    ]);
    const res = await tx(
      contracts[vault.name].withdraw(
        parseUnits(unformattedAmount, vault.collateralAsset.decimals),
        {
          gasLimit,
        },
      ),
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

  const doAction = withApproval => {
    if (action === Action.Withdraw) {
      withdraw(withApproval);
    } else {
      supply(withApproval);
    }
  };

  const approve = async infiniteApproval => {
    let unFormattedAmount = amount;
    if (parseUnits(amount, vault.collateralAsset.decimals).eq(collateralBalance)) {
      unFormattedAmount = (Number(amount) * 1.02).toFixed(6);
    }

    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval
      ? base.pow(e).sub(1)
      : parseUnits(unFormattedAmount, vault.collateralAsset.decimals);

    setDialog({ step: 'approvalPending', withApproval: true });
    const res = await tx(
      contracts[vault.collateralAsset.name].approve(
        contracts[vault.name].address,
        BigNumber.from(approveAmount),
      ),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(ev => ev.event === 'Approval')) {
        doAction(true);
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    // const totalCollateral = Number(amount) + Number(formatUnits(collateralBalance));
    // if (action === Action.Supply && totalCollateral > ETH_CAP_VALUE) {
    //   setDialog({step:'capCollateral'});
    //   return;
    // }

    setLoading(true);

    if (vault.collateralAsset.isERC20 && action === Action.Supply) {
      if (parseUnits(amount, collateralAsset.decimals).gt(allowance)) {
        setDialog({ step: 'approval', withApproval: true });
      } else {
        doAction(false);
      }
      return;
    }

    doAction(false);
  };

  const onConfirmation = () => {
    setDialog({ step: 'deltaRatios' });
  };

  const handleClose = () => {
    setDialog('');
    setAmount('');
  };

  const getBtnContent = () => {
    if (vault.collateralAsset.isERC20) {
      if (!loading) {
        return action === Action.Withdraw ? 'Withdraw' : 'Supply';
      }

      if (dialog.step === 'approvalPending') {
        return 'Approving... 1 of 2';
      }
      if (dialog.step === 'doing') {
        return `${action === Action.Withdraw ? 'Withdraw' : 'Supply'}ing... ${
          dialog.withApproval ? '2 of 2' : ''
        }`;
      }
    }

    return `${action === Action.Withdraw ? 'Withdraw' : 'Supply'}${loading ? '...' : ''}`;
  };

  const dialogContents = {
    deltaRatios: {
      title: 'Postion Ratio Changes',
      content: (
        <DeltaPositionRatios
          borrowAsset={vault.borrowAsset}
          collateralAsset={vault.collateralAsset}
          currentCollateral={collateralBalance}
          currentDebt={debtBalance}
          newDebt={debtBalance}
          newCollateral={
            !collateralBalance || !amount
              ? 0
              : action === Action.Withdraw
              ? collateralBalance.sub(parseUnits(amount, vault.collateralAsset.decimals))
              : collateralBalance.add(parseUnits(amount, vault.collateralAsset.decimals))
          }
          provider={provider}
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
    approval: {
      title: 'Approving... 1 of 2',
      content: <DialogContentText>You need first to approve a spending limit.</DialogContentText>,
      actions: () => {
        return (
          <DialogActions>
            <Button onClick={() => approve(false)} className="main-button">
              Approve {Number(amount).toFixed(2)} {collateralAsset.name}
            </Button>
            <Button onClick={() => approve(true)} className="main-button">
              Infinite Approve
            </Button>
            q
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
        open={['dialog', 'capCollateral', 'deltaRatios', 'approval'].includes(dialog.step)}
        aria-labelledby="form-dialog-title"
      >
        <div className="close" onClick={handleClose}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog.step]?.title}</DialogTitle>
        <DialogContent>{dialogContents[dialog.step]?.content}</DialogContent>
        {dialogContents[dialog.step]?.actions()}
      </Dialog>

      <Grid item className="section-title">
        <SectionTitle fontSize={isMobile ? '16px' : '20px'}>Collateral</SectionTitle>
        {!isMobile && !isTablet && (
          <div className="tooltip-info">
            <InfoOutlinedIcon />
            <span className="tooltip tooltip-top">
              <span className="bold">Supply</span> more {vault.collateralAsset.name} as collateral
              or
              <span className="bold"> withdraw</span> what is not locked for your borrows.
            </span>
          </div>
        )}
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
          onChange={value => {
            return setAmount(value);
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
              value: action === Action.Supply ? userBalance : leftCollateral,
              message: 'insufficient-balance',
            },
          })}
          subTitle={action === Action.Supply ? 'Available to supply:' : 'Available to withdraw:'}
          subTitleInfo={
            action === Action.Supply
              ? `${userBalance ? Number(userBalance).toFixed(3) : '...'} ${
                  vault.collateralAsset.name
                } Ξ`
              : `${leftCollateral ? Number(leftCollateral).toFixed(3) : '...'} ${
                  vault.collateralAsset.name
                } Ξ`
          }
          startAdornmentImage={vault.collateralAsset.icon}
          endAdornment={{
            type: 'component',
            component: (
              <InputAdornment position="end">
                {focus && (
                  <Button
                    className="max-button"
                    onClick={() => {
                      setAmount(action === Action.Supply ? userBalance : leftCollateral);
                      setValue('amount', action === Action.Supply ? userBalance : leftCollateral, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    max
                  </Button>
                )}
                <Label>{vault.collateralAsset.name}</Label>
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
                Insufficient {vault.collateralAsset.name} balance
              </Typography>
            ) : (
              errors?.amount?.message === 'insufficient-balance' &&
              action === Action.Withdraw && (
                <Typography className="error-input-msg" variant="body2">
                  You can withdraw max. {leftCollateral} {vault.collateralAsset.name}
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
          {getBtnContent()}
        </Button>
      </Grid>
    </Grid>
  );
}

export default CollateralForm;
