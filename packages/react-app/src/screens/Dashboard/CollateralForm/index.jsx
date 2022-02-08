import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Grid,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Flex } from 'rebass';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Transactor, GasEstimator, fixDecimalString } from 'helpers';
import { useAuth, useBalance, useAllowance, useContractLoader, useContractReader } from 'hooks';
import { ETH_CAP_VALUE } from 'consts/globals';
import { useMediaQuery } from 'react-responsive';
import { BigNumber } from '@ethersproject/bignumber';

import { BREAKPOINTS, BREAKPOINT_NAMES, ASSET_NAME } from 'consts';
import {
  TextInput,
  Label,
  Tooltip,
  SectionTitle,
  IntenseSpan,
  Button,
  ToggleSwitch,
  MaxButton,
  ErrorInputMessage,
} from 'components';

import DeltaPositionRatios from '../DeltaPositionRatios';
// import { SectionTitle } from '../../../components/Blocks';

const Action = {
  Supply: 0,
  Withdraw: 1,
};

function CollateralForm({ position }) {
  const { address, provider } = useAuth();
  const contracts = useContractLoader();

  const { register, errors, setValue, handleSubmit, clearErrors } = useForm({ mode: 'onChange' });
  const tx = Transactor(provider);

  const [action, setAction] = useState(Action.Supply);
  const [dialog, setDialog] = useState('');
  // const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [leftCollateral, setLeftCollateral] = useState('');

  const { vaultAddress, vault } = position;
  const { collateralAsset } = vault;

  const unformattedUserBalance = useBalance(
    provider,
    address,
    contracts,
    collateralAsset.name,
    collateralAsset.isERC20,
  );

  const userBalance = unformattedUserBalance
    ? fixDecimalString(formatUnits(unformattedUserBalance, collateralAsset.decimals), 6)
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

  const allowance = useAllowance(contracts, collateralAsset, [address, vaultAddress]);
  const { t } = useTranslation();
  useEffect(() => {
    if (neededCollateral && collateralBalance) {
      const diff = formatUnits(collateralBalance.sub(neededCollateral), collateralAsset.decimals);
      // use toFixed to avoid scientific notation 2.1222e-6
      setLeftCollateral(fixDecimalString(diff, 6));
    }
  }, [neededCollateral, collateralBalance, collateralAsset.decimals]);

  const supply = async withApproval => {
    setDialog({ step: 'doing', withApproval });

    const parsedAmount = parseUnits(amount, collateralAsset.decimals);
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
      parseUnits(unformattedAmount, collateralAsset.decimals),
    ]);
    const res = await tx(
      contracts[vault.name].withdraw(parseUnits(unformattedAmount, collateralAsset.decimals), {
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Withdraw')) {
        setDialog({ step: 'success' });
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
    if (parseUnits(amount, collateralAsset.decimals).eq(collateralBalance)) {
      unFormattedAmount = fixDecimalString(amount * 1.02, 6);
    }

    const base = BigNumber.from(2);
    const e = BigNumber.from(256);
    const approveAmount = infiniteApproval
      ? base.pow(e).sub(1)
      : parseUnits(unFormattedAmount, collateralAsset.decimals);

    setDialog({ step: 'approvalPending', withApproval: true });
    const res = await tx(
      contracts[collateralAsset.name].approve(
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
    if (!collateralAsset.isERC20 && collateralAsset.name === ASSET_NAME.ethereum.ETH) {
      const totalCollateral = Number(amount) + Number(formatUnits(collateralBalance));
      if (action === Action.Supply && totalCollateral > ETH_CAP_VALUE) {
        setDialog({ step: 'capCollateral' });
        return;
      }
    }

    setLoading(true);

    if (collateralAsset.isERC20 && action === Action.Supply) {
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
    setValue('amount', '', { shouldValidate: false });
    setLoading(false);
  };

  const getBtnContent = () => {
    if (collateralAsset.isERC20) {
      if (!loading) {
        return action === Action.Withdraw ? (
          <Trans i18nKey="global.withdraw" t={t}>
            Withdraw
          </Trans>
        ) : (
          <Trans i18nKey="global.supply" t={t}>
            Supply
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
      if (dialog.step === 'doing') {
        return (
          <>
            {action === Action.Withdraw ? (
              <Trans i18nKey="global.withdrawing" t={t}>
                Withdrawing...
              </Trans>
            ) : (
              <Trans i18nKey="global.supplying" t={t}>
                Supplying...
              </Trans>
            )}
            {dialog.withApproval ? '2 of 2' : ''}
          </>
        );
      }
    }

    return action === Action.Withdraw ? (
      <Trans i18nKey={loading ? 'global.withdrawing' : 'global.withdraw'} t={t}>
        {loading ? 'Withdrawing...' : 'Withdraw'}
      </Trans>
    ) : (
      <Trans i18nKey={loading ? 'global.supplying' : 'global.supply'} t={t}>
        {loading ? 'Supplying...' : 'Supply'}
      </Trans>
    );
  };

  const handleMaxBalance = () => {
    setAmount(action === Action.Supply ? userBalance : leftCollateral);
    setValue('amount', action === Action.Supply ? userBalance : leftCollateral, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClickTitleInfo =
    (action === Action.Supply ? Number(userBalance) : Number(leftCollateral)) > 0
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
          newDebt={debtBalance}
          newCollateral={
            !collateralBalance || !amount
              ? 0
              : action === Action.Withdraw
              ? collateralBalance.sub(parseUnits(amount, collateralAsset.decimals))
              : collateralBalance.add(parseUnits(amount, collateralAsset.decimals))
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
              noResizeOnResponsive
              block
            >
              <Trans i18nKey="global.confirm" t={t}>
                Confirm
              </Trans>
            </Button>
          </DialogActions>
        );
      },
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
      actions: () => {
        return (
          <DialogActions>
            <Button onClick={() => approve(false)} block noResizeOnResponsive>
              <Trans i18nKey="global.approve" t={t}>
                Approve
              </Trans>{' '}
              {fixDecimalString(amount, 3)} {collateralAsset.name}
            </Button>
            <Button onClick={() => approve(true)} block noResizeOnResponsive>
              <Trans i18nKey="global.approvalModal.infiniteApprove" t={t}>
                Infinite Approve
              </Trans>
            </Button>
          </DialogActions>
        );
      },
    },
    success: {
      title: (
        <Trans i18nKey="global.successModal.title" t={t}>
          Transaction successful
        </Trans>
      ),
      content: (
        <DialogContentText>
          <Trans
            i18nKey={
              action === Action.Supply
                ? 'global.successModal.suppliedSuccessDescription'
                : 'global.successModal.suppliedWithdrawnDescription'
            }
            t={t}
          >
            {action === Action.Supply
              ? `You have successfully supplied {{ amount }} {{ assetName: collateralAsset.name }}.`
              : `You have successfully withdrawn {{ amount }} {{ assetName: collateralAsset.name }}.`}
          </Trans>
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
              noResizeOnResponsive
              block
            >
              <Trans i18nKey="global.close" t={t}>
                Close
              </Trans>
            </Button>
          </DialogActions>
        );
      },
    },
    capCollateral: {
      title: (
        <Trans i18nKey="global.capCollateralModal.title" t={t}>
          Collateral Cap
        </Trans>
      ),
      content: (
        <DialogContentText>
          <Trans i18nKey="global.capCollateralModal.description" t={t}>
            The total amount of {{ assetName: collateralAsset.name }} you provide as collateral
            exceeds {{ cap: ETH_CAP_VALUE }} {{ assetName: collateralAsset.name }}. This limit is
            set because the contracts are not audited yet and we want to cap the risk. Please, bear
            in mind that the alpha version is meant just to demonstrate the functioning of the
            protocol in real conditions. A fully fledged version will be available soon.
          </Trans>
        </DialogContentText>
      ),
      actions: () => {
        return (
          <DialogActions>
            <Button
              onClick={() => {
                setDialog('');
              }}
              block
              noResizeOnResponsive
            >
              <Trans i18nKey="global.close" t={t}>
                Close
              </Trans>
            </Button>
          </DialogActions>
        );
      },
    },
  };

  return (
    <Grid container direction="column">
      <Dialog
        open={['capCollateral', 'deltaRatios', 'approval', 'success'].includes(dialog.step)}
        aria-labelledby="form-dialog-title"
      >
        <div className="close" onClick={handleClose}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog.step]?.title}</DialogTitle>
        <DialogContent>{dialogContents[dialog.step]?.content}</DialogContent>
        {dialogContents[dialog.step]?.actions()}
      </Dialog>

      <Grid item>
        <Flex mb={isMobile ? '1rem' : '1.5rem'}>
          <SectionTitle fontSize={isMobile ? '16px' : '20px'}>
            <Trans i18nKey="global.collateral" t={t}>
              Collateral
            </Trans>
          </SectionTitle>
          {!isMobile && !isTablet && (
            <Tooltip>
              <InfoOutlinedIcon />
              <span>
                <Trans i18nKey="collateralForm.tooltip" t={t}>
                  <IntenseSpan>Supply</IntenseSpan> more
                  {{ collateralAssetName: collateralAsset.name }} as collateral or
                  <IntenseSpan> withdraw</IntenseSpan> what is not locked for your borrows.
                </Trans>
              </span>
            </Tooltip>
          )}
        </Flex>
      </Grid>
      <Grid item>
        <ToggleSwitch
          firstOption={t('global.supply')}
          secondOption={t('global.withdraw')}
          onSwitch={setAction}
          mb="1.5rem"
        />
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
          // onFocus={() => {
          //   return setFocus(true);
          // }}
          onClickTitleInfo={handleClickTitleInfo}
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
          subTitle={
            action === Action.Supply ? (
              <Trans i18nKey="collateralForm.availableToSupply" t={t}>
                Available to supply:
              </Trans>
            ) : (
              <Trans i18nKey="collateralForm.availableToWithdraw" t={t}>
                Available to withdraw:
              </Trans>
            )
          }
          subTitleInfo={
            action === Action.Supply
              ? `${userBalance ? fixDecimalString(userBalance, 3) : '...'} ${collateralAsset.name}`
              : `${leftCollateral ? fixDecimalString(leftCollateral, 3) : '...'} ${
                  collateralAsset.name
                }`
          }
          startAdornmentImage={collateralAsset.icon}
          endAdornment={{
            type: 'component',
            component: (
              <InputAdornment position="end">
                <MaxButton onClick={handleMaxBalance}>
                  <Trans i18nKey="global.max" t={t}>
                    max
                  </Trans>
                </MaxButton>
                <Label>{collateralAsset.name}</Label>
              </InputAdornment>
            ),
          }}
          errorComponent={
            errors?.amount?.message === 'insufficient-amount' ? (
              <ErrorInputMessage>
                <Trans i18nKey="collateralForm.errors.insufficientAmount" t={t}>
                  Please, type an amount to
                  {{ action: action === Action.Withdraw ? 'withdraw' : 'supply' }}
                </Trans>
              </ErrorInputMessage>
            ) : errors?.amount?.message === 'insufficient-balance' && action === Action.Supply ? (
              <ErrorInputMessage>
                <Trans i18nKey="collateralForm.errors.insufficientBalanceToSupply" t={t}>
                  Insufficient {{ collateralAssetName: collateralAsset.name }} balance
                </Trans>
              </ErrorInputMessage>
            ) : (
              errors?.amount?.message === 'insufficient-balance' &&
              action === Action.Withdraw && (
                <ErrorInputMessage>
                  <Trans i18nKey="collateralForm.errors.insufficientBalanceToWithdraw" t={t}>
                    You can withdraw max: {{ leftCollateral }}
                    {{ collateralAssetName: collateralAsset.name }}
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

export default CollateralForm;
