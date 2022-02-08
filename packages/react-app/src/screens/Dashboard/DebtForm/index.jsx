import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';
import { Trans, useTranslation } from 'react-i18next';

import {
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@material-ui/core';

import { InfoOutlined, HighlightOff } from '@material-ui/icons';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Flex } from 'rebass';

import {
  useContractReader,
  useExchangePrice,
  useBalance,
  useAllowance,
  useAuth,
  useContractLoader,
} from 'hooks';

import {
  TextInput,
  Label,
  SectionTitle,
  Tooltip,
  IntenseSpan,
  Button,
  ToggleSwitch,
  MaxButton,
  ErrorInputMessage,
} from 'components';

import { Transactor, GasEstimator, fixDecimalString } from '../../../helpers';

import DeltaPositionRatios from '../DeltaPositionRatios';

const Action = {
  Repay: 0,
  Borrow: 1,
};

function DebtForm({ position }) {
  const { address, provider } = useAuth();
  const contracts = useContractLoader();

  const { register, errors, setValue, handleSubmit, clearErrors } = useForm({ mode: 'onChange' });
  const tx = Transactor(provider);

  const [action, setAction] = useState(Action.Repay);
  // const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftToBorrow, setLeftToBorrow] = useState('');
  const [maxToRepay, setMaxToRepay] = useState('');
  const [dialog, setDialog] = useState({ step: null, withApproval: false });

  const { vaultAddress, vault } = position;
  const { collateralAsset, borrowAsset } = vault;
  const { decimals } = vault.borrowAsset;

  const borrowPrice = useExchangePrice(borrowAsset);
  const collateralPrice = useExchangePrice(collateralAsset);

  const unFormattedBalance = useBalance(
    provider,
    address,
    contracts,
    borrowAsset.name,
    borrowAsset.isERC20,
    1000,
  );

  const balance = unFormattedBalance
    ? fixDecimalString(formatUnits(unFormattedBalance, decimals), 6)
    : null;

  const allowance = useAllowance(contracts, borrowAsset, [address, vaultAddress]);

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

  const { t } = useTranslation();

  useEffect(() => {
    if (neededCollateral && collateralBalance) {
      const colDecimals = vault.collateralAsset.decimals;
      const diff = Number(formatUnits(collateralBalance.sub(neededCollateral), colDecimals));
      const ratio = vault.threshold / 100;
      const left = ((diff * ratio) / borrowPrice) * collateralPrice;
      const leftAmount = left < 0 ? 0 : left;

      setLeftToBorrow(fixDecimalString(leftAmount, 6));
    }
  }, [neededCollateral, collateralBalance, borrowPrice, collateralPrice, vault]);

  useEffect(() => {
    if (balance && debtBalance) {
      const debt = formatUnits(debtBalance, decimals);
      const max = Number(debt) > Number(balance) ? balance : debt;
      setMaxToRepay(fixDecimalString(max, 6));
    }
  }, [debtBalance, balance, decimals]);

  const borrow = async () => {
    const gasLimit = await GasEstimator(contracts[vault.name], 'borrow', [
      parseUnits(amount, decimals),
    ]);
    const res = await tx(
      contracts[vault.name].borrow(parseUnits(amount, decimals), {
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

    // let unFormattedAmount = parseUnits(amount, decimals).eq(debtBalance) ? '-1' : amount;

    // another check when user wants to repay max
    // pass just the max amount of their balance and no -1
    // because they probably don't have to repay the accrued interest

    // TODO
    const unFormattedAmount =
      parseUnits(amount, decimals).eq(debtBalance) && debtBalance.eq(unFormattedBalance)
        ? formatUnits(unFormattedBalance, decimals)
        : amount;

    const gasLimit = await GasEstimator(contracts[vault.name], 'payback', [
      parseUnits(unFormattedAmount, decimals),
      { value: borrowAsset.isERC20 ? 0 : parseUnits(unFormattedAmount, decimals) },
    ]);

    const res = await tx(
      contracts[vault.name].payback(parseUnits(unFormattedAmount, decimals), {
        value: borrowAsset.isERC20 ? 0 : parseUnits(unFormattedAmount, decimals),
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Payback')) {
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
      unFormattedAmount = fixDecimalString(amount * 1.02, 6);
    }

    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval
      ? base.pow(e).sub(1)
      : parseUnits(unFormattedAmount, decimals);
    setDialog({ step: 'approvalPending', withApproval: true });
    const res = await tx(
      contracts[borrowAsset.name].approve(
        contracts[vault.name].address,
        BigNumber.from(approveAmount),
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
      if (borrowAsset.isERC20) {
        if (parseUnits(amount, decimals).gt(allowance)) {
          setDialog({ step: 'approval', withApproval: true });
        } else {
          payback(false);
        }
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

  const handleMaxBalance = () => {
    const value = action === Action.Repay ? maxToRepay : leftToBorrow;
    setAmount(value);
    setValue('amount', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClickTitleInfo =
    (action === Action.Repay ? Number(maxToRepay) : Number(leftToBorrow)) > 0
      ? handleMaxBalance
      : undefined;

  const dialogContents = {
    deltaRatios: {
      title: (
        <Trans i18nKey="global.deltaRatiosModal.title" t={t}>
          Position Ratio Changes
        </Trans>
      ),
      content: (
        <DeltaPositionRatios
          vault={vault}
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
            block
            noResizeOnResponsive
          >
            <Trans i18nKey="global.confirm" t={t}>
              Confirm
            </Trans>
          </Button>
        </DialogActions>
      ),
    },
    approval: {
      title: (
        <>
          <Trans i18nKey="global.approving" t={t}>
            Approving
          </Trans>
          ... 1 of 2
        </>
      ),
      content: (
        <DialogContentText>
          <Trans i18nKey="global.approvalModal.title" t={t}>
            You need first to approve a spending limit.
          </Trans>
        </DialogContentText>
      ),
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} block noResizeOnResponsive>
            <Trans i18nKey="global.approve" t={t}>
              Approve
            </Trans>{' '}
            {fixDecimalString(amount, 3)} {borrowAsset.name}
          </Button>
          <Button onClick={() => approve(true)} block noResizeOnResponsive>
            <Trans i18nKey="global.approvalModal.infiniteApprove" t={t}>
              Infinite Approve
            </Trans>
          </Button>
        </DialogActions>
      ),
    },
    success: {
      title: (
        <Trans i18nKey="global.successModal.title" t={t}>
          Transaction successful
        </Trans>
      ),
      content: (
        <DialogContentText>
          You have successfully {action === Action.Repay ? 'repay' : 'borrow'}ed {amount}{' '}
          {borrowAsset.name}.
          <Trans
            i18nKey={
              action === Action.Repay
                ? 'global.successModal.repaidSuccessDescription'
                : 'global.successModal.borrowedSuccessDescription'
            }
            t={t}
          >
            {action === Action.Repay
              ? `You have successfully reapid {{ amount }} {{ assetName: collateralAsset.name }}.`
              : `You have successfully borrowed {{ amount }} {{ assetName: collateralAsset.name }}.`}
          </Trans>
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
            block
            noResizeOnResponsive
          >
            <Trans i18nKey="global.close" t={t}>
              Close
            </Trans>
          </Button>
        </DialogActions>
      ),
    },
  };

  const getBtnContent = () => {
    if (action === Action.Repay) {
      if (!loading) {
        return (
          <Trans i18nKey="global.repay" t={t}>
            Repay
          </Trans>
        );
      }

      if (dialog.step === 'approvalPending') {
        return (
          <>
            <Trans i18nKey="global.approving" t={t}>
              Approving
            </Trans>
            ... 1 of 2
          </>
        );
      }
      if (dialog.step === 'repaying') {
        return (
          <>
            <Trans i18nKey="global.repaying" t={t}>
              Repaying
            </Trans>
            ...{dialog.withApproval ? '2 of 2' : ''}
          </>
        );
      }
    }
    return (
      <>
        <Trans i18nKey={loading ? 'global.borrowing' : 'global.borrow'} t={t}>
          {loading ? 'Borrowing' : 'Borrow'}
        </Trans>
        {loading ? '...' : ''}
      </>
    );
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
          <HighlightOff />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog.step]?.title}</DialogTitle>
        <DialogContent>{dialogContents[dialog.step]?.content}</DialogContent>
        {dialogContents[dialog.step]?.actions()}
      </Dialog>
      <Grid item>
        <Flex mb={isMobile ? '1rem' : '1.5rem'}>
          <SectionTitle fontSize={isMobile ? '16px' : '20px'}>
            <Trans i18nKey="global.debt" t={t}>
              Debt
            </Trans>
          </SectionTitle>

          {!isMobile && !isTablet && (
            <Tooltip>
              <InfoOutlined />
              <span>
                <Trans i18nKey="debtForm.tooltip" t={t}>
                  <IntenseSpan>Repay</IntenseSpan> {{ borrowAssetName: borrowAsset.name }} from your
                  wallet balance or
                  <IntenseSpan> borrow</IntenseSpan> more from it against your free collateral.
                </Trans>
              </span>
            </Tooltip>
          )}
        </Flex>
      </Grid>
      <Grid item>
        <ToggleSwitch
          firstOption={t('global.repay')}
          secondOption={t('global.borrow')}
          onSwitch={setAction}
          mb="1.5rem"
        />
      </Grid>

      <Grid item>
        <TextInput
          id="debtAmount"
          name="amount"
          type="number"
          step="any"
          onChange={value => setAmount(value)}
          // onFocus={() => setFocus(true)}
          onClickTitleInfo={handleClickTitleInfo}
          onBlur={() => clearErrors()}
          ref={register({
            required: { value: true, message: 'insufficient-amount' },
            min: { value: 0, message: 'insufficient-amount' },
            max: {
              value: action === Action.Repay ? maxToRepay : leftToBorrow,
              message: 'insufficient-balance',
            },
          })}
          subTitle={
            action === Action.Repay ? (
              <Trans i18nKey="debtForm.availableToRepay" t={t}>
                Available to repay:
              </Trans>
            ) : (
              <Trans i18nKey="debtForm.availableToBorrow" t={t}>
                Available to borrow:
              </Trans>
            )
          }
          subTitleInfo={
            action === Action.Repay
              ? `${maxToRepay ? fixDecimalString(maxToRepay, 3) : '...'} ${borrowAsset.name}`
              : `${leftToBorrow ? fixDecimalString(leftToBorrow, 3) : '...'} ${borrowAsset.name}`
          }
          startAdornmentImage={borrowAsset.icon}
          endAdornment={{
            type: 'component',
            component: (
              <InputAdornment position="end">
                <MaxButton onClick={handleMaxBalance}>
                  <Trans i18nKey="global.max" t={t}>
                    max
                  </Trans>
                </MaxButton>
                <Label>{borrowAsset.name}</Label>
              </InputAdornment>
            ),
          }}
          errorComponent={
            errors?.amount?.message === 'insufficient-amount' ? (
              <ErrorInputMessage>
                <Trans i18nKey="debtForm.errors.insufficientAmount" t={t}>
                  Please, type the amount you like to
                  {{ action: action === Action.Repay ? 'repay' : 'borrow' }}
                </Trans>
              </ErrorInputMessage>
            ) : errors?.amount?.message === 'insufficient-balance' && action === Action.Repay ? (
              <ErrorInputMessage>
                <Trans i18nKey="debtForm.errors.insufficientBalanceToRepay" t={t}>
                  You can repay max {{ maxToRepay }} {{ borrowAssetName: borrowAsset.name }}.
                </Trans>
              </ErrorInputMessage>
            ) : (
              errors?.amount?.message === 'insufficient-balance' &&
              action === Action.Borrow && (
                <ErrorInputMessage>
                  <Trans i18nKey="debtForm.errors.insufficientBalanceToBorrow" t={t}>
                    You can borrow max
                    <span>
                      {{ leftToBorrow }} {{ borrowAssetName: borrowAsset.name }}
                    </span>
                    . Provide more collateral!
                  </Trans>
                </ErrorInputMessage>
              )
            )
          }
        />
      </Grid>
      <Grid item>
        <Button onClick={handleSubmit(onConfirmation)} block fontWeight={600} disabled={loading}>
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            {loading && (
              <CircularProgress
                style={{
                  width: 25,
                  height: 25,
                  marginRight: '16px',
                  color: 'rgba(0, 0, 0, 0.26)',
                }}
              />
            )}
            {getBtnContent()}
          </Flex>
        </Button>
      </Grid>
    </Grid>
  );
}

export default DebtForm;
