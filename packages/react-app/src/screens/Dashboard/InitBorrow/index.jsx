import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Box, Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import find from 'lodash/find';

import { ETH_CAP_VALUE } from 'consts/globals';
import {
  CollaterizationIndicator,
  ProvidersList,
  HowItWorks,
  DisclaimerPopup,
  SelectVault,
  BlackBoxContainer,
  SelectMarket,
  Button,
  ErrorInputMessage,
} from 'components';
import { TextInput } from 'components/UI';
import { PROVIDERS, BREAKPOINTS, BREAKPOINT_NAMES, CHAIN_NAMES, ASSET_NAME } from 'consts';
import { Transactor, GasEstimator, fixDecimal } from 'helpers';
import {
  useAuth,
  useBalance,
  useAllowance,
  useResources,
  useContractLoader,
  useContractReader,
  useExchangePrice,
} from 'hooks';

import { Container, Helper } from './styles';

function InitBorrow() {
  const { address, provider, networkName } = useAuth();
  const contracts = useContractLoader();
  const { vaults } = useResources();

  const defaultVault = vaults[0];
  const queries = new URLSearchParams(useLocation().search);

  const { register, errors, handleSubmit, clearErrors } = useForm({ mode: 'all' });
  const [checkedClaim, setCheckedClaim] = useState(false);

  const [borrowAmount, setBorrowAmount] = useState(queries.get('borrowAmount') || '1000');
  const [borrowAsset, setBorrowAsset] = useState(defaultVault.borrowAsset);
  // const [market, setMarket] = useState(MARKETS[MARKET_NAMES.CORE]);
  const [vault, setVault] = useState(defaultVault);
  const [collateralAsset, setCollateralAsset] = useState(defaultVault.collateralAsset);
  const [collateralAmount, setCollateralAmount] = useState('');

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const allowance = useAllowance(contracts, collateralAsset, [
    address,
    vault && contracts ? contracts[vault.name]?.address : '0x',
  ]);

  useEffect(() => {
    if (borrowAsset && collateralAsset) {
      const v = find(
        vaults,
        key =>
          key.borrowAsset.name === borrowAsset.name &&
          key.collateralAsset.name === collateralAsset.name,
      );
      setVault(v);
    }
  }, [vaults, borrowAsset, collateralAsset]);

  // when switching network
  useEffect(() => {
    setCollateralAsset(defaultVault.collateralAsset);
    setBorrowAsset(defaultVault.borrowAsset);
  }, [defaultVault]);

  const pollUnformatedUserBalance = useBalance(
    provider,
    address,
    contracts,
    collateralAsset.name,
    collateralAsset.isERC20,
  );

  const balance = pollUnformatedUserBalance
    ? fixDecimal(formatUnits(pollUnformatedUserBalance, collateralAsset.decimals), 6)
    : null;

  const activeProvider = useContractReader(contracts, vault.name, 'activeProvider');
  const borrowAssetPrice = useExchangePrice(borrowAsset);
  const collateralAssetPrice = useExchangePrice(collateralAsset);

  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.borrowId,
  ]);
  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.collateralId,
  ]);

  const unFormattedNeededCollateral = useContractReader(
    contracts,
    vault.name,
    'getNeededCollateralFor',
    [
      debtBalance ? debtBalance.add(parseUnits(borrowAmount || '0', borrowAsset.decimals)) : '0',
      'true',
    ],
  );

  const neededCollateral =
    collateralBalance && unFormattedNeededCollateral
      ? Number(
          formatUnits(unFormattedNeededCollateral.sub(collateralBalance), collateralAsset.decimals),
        )
      : 0;

  console.log({
    neededCollateral,
    test: fixDecimal('0.5', 6),
  });

  const position = {
    vault: vault ?? defaultVault,
    debtBalance: debtBalance
      ? debtBalance.add(parseUnits(borrowAmount || '0', borrowAsset.decimals))
      : 0,
    // !debtBalance || !borrowAmount
    // ? 0
    // : debtBalance.add(parseUnits(borrowAmount, borrowAsset.decimals)),
    collateralBalance: collateralBalance
      ? collateralBalance.add(parseUnits(collateralAmount || '0', collateralAsset.decimals))
      : 0,
    // !collateralBalance || !collateralAmount
    // ? 0
    // : collateralBalance.add(parseUnits(collateralAmount, collateralAsset.decimals)),
  };

  const tx = Transactor(provider);

  const borrow = async withApproval => {
    setDialog({ step: 'borrowing', withApproval });

    const gasLimit = await GasEstimator(contracts[vault.name], 'depositAndBorrow', [
      parseUnits(collateralAmount, collateralAsset.decimals),
      parseUnits(borrowAmount, borrowAsset.decimals),
      {
        value: collateralAsset.isERC20 ? 0 : parseUnits(collateralAmount, collateralAsset.decimals),
      },
    ]);
    const res = await tx(
      contracts[vault.name].depositAndBorrow(
        parseUnits(collateralAmount, collateralAsset.decimals),
        parseUnits(borrowAmount, borrowAsset.decimals),
        {
          value: collateralAsset.isERC20
            ? 0
            : parseUnits(collateralAmount, collateralAsset.decimals),
          gasLimit,
        },
      ),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Borrow')) {
        setDialog({ step: 'success' });
      }
    }
    setLoading(false);
  };

  const approve = async infiniteApproval => {
    let unFormattedAmount = collateralAmount;
    if (parseUnits(collateralAmount, collateralAsset.decimals).eq(collateralBalance)) {
      unFormattedAmount = fixDecimal(Number(collateralAmount) * 1.02, 6);
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
        borrow(true);
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (Number(collateralAmount) <= 0 || Number(borrowAmount) <= 0) {
      setDialog({ step: 'validateInput' });
      return;
    }

    if (!collateralAsset.isERC20) {
      const totalCollateral = Number(collateralAmount) + Number(formatUnits(collateralBalance));
      if (totalCollateral > ETH_CAP_VALUE && collateralAsset.name === ASSET_NAME.ethereum.ETH) {
        setDialog({ step: 'capCollateral' });
        return;
      }
    }

    setLoading(true);

    if (collateralAsset.isERC20) {
      if (parseUnits(collateralAmount, collateralAsset.decimals).gt(allowance)) {
        setDialog({ step: 'approval', withApproval: true });
      } else {
        await borrow(false);
      }
      return;
    }

    await borrow(false);
  };

  const handleChangeVault = v => {
    setBorrowAsset(v.borrowAsset);
    setCollateralAsset(v.collateralAsset);
    setVault(v);

    if (v.collateralAsset.isERC20) setBorrowAmount('1');
    else setBorrowAmount('1000');
  };

  const getActiveProviderName = () => {
    if (!activeProvider) return '...';
    return find(Object.values(PROVIDERS), p => contracts[p.name]?.address === activeProvider)
      ?.title;
  };

  const getBorrowBtnContent = () => {
    if (collateralAsset.isERC20) {
      if (!loading) {
        return 'Borrow';
      }

      if (dialog.step === 'approvalPending') {
        return 'Approving... 1 of 2';
      }
      if (dialog.step === 'borrowing') {
        return `Borrowing... ${dialog.withApproval ? '2 of 2' : ''}`;
      }
    }

    return loading ? 'Borrowing...' : 'Borrow';
  };

  const dialogContents = {
    success: {
      title: 'Success',
      content: 'Your transaction has been processed, you can check now your position.',
      actions: () => (
        <DialogActions>
          <NavLink to="/dashboard/my-positions" style={{ width: '100%' }}>
            <Button block noResizeOnResponsive>
              Check my positions
            </Button>
          </NavLink>
        </DialogActions>
      ),
    },
    approval: {
      title: 'Approving... 1 of 2',
      content: 'You need first to approve a spending limit.',
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} noResizeOnResponsive>
            Approve {fixDecimal(collateralAmount, 6)} {collateralAsset.name}
          </Button>
          <Button onClick={() => approve(true)} noResizeOnResponsive>
            Infinite Approve
          </Button>
        </DialogActions>
      ),
    },
    capCollateral: {
      title: 'Collateral Cap',
      content: `The total amount of ETH you provide as collateral exceeds ${ETH_CAP_VALUE} ETH. This limit is set because the contracts are not audited yet and we want to cap the risk. Please, bear in mind that the alpha version is meant just to demonstrate the functioning of the protocol in real conditions. A fully fledged version will be available soon.`,
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog({ step: null });
            }}
            block
            noResizeOnResponsive
          >
            Close
          </Button>
        </DialogActions>
      ),
    },
    validateInput: {
      title: 'Input Validation',
      content: `Incorect amount of collateral and/or borrow amount!`,
      actions: () => (
        <DialogActions>
          <Button
            onClick={() => {
              setDialog({ step: null });
            }}
            block
            noResizeOnResponsive
          >
            Close
          </Button>
        </DialogActions>
      ),
    },
  };

  return (
    <Container>
      <Dialog
        open={['success', 'capCollateral', 'approval', 'validateInput'].includes(dialog.step)}
        aria-labelledby="form-dialog-title"
      >
        <div
          className="close"
          onClick={() => {
            setDialog({ step: null });
            setLoading(false);
          }}
        >
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog.step]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContents[dialog.step]?.content}</DialogContentText>
        </DialogContent>
        {dialogContents[dialog.step]?.actions()}
      </Dialog>
      <Box
        minWidth={isMobile ? '320px' : isTablet ? '420px' : '1200px'}
        width={isMobile ? '320px' : isTablet ? '470px' : '1200px'}
        margin={isMobile ? '32px 28px' : isTablet ? '36px' : '24px 160px'}
      >
        <Grid container spacing={isMobile ? 4 : isTablet ? 4 : 6}>
          <Grid item xs={12} sm={12} md={4}>
            <Box ml={isMobile || isTablet ? '' : '56px'}>
              {!isMobile && !isTablet && <HowItWorks />}
              <BlackBoxContainer
                hasBlackContainer
                padding={isMobile ? '32px 28px' : isTablet ? '44px 36px 40px' : '32px 28px'}
              >
                <Grid container spacing={isMobile ? 3 : 4}>
                  {networkName !== CHAIN_NAMES.FANTOM && (
                    <Grid item xs={8} sm={8} md={12}>
                      <SelectMarket />
                    </Grid>
                  )}
                  <Grid item xs={4} sm={4} md={12}>
                    <ProvidersList
                      markets={[borrowAsset.name]}
                      title="APR"
                      isDropDown
                      hasBlackContainer={false}
                    />
                  </Grid>
                </Grid>
              </BlackBoxContainer>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <BlackBoxContainer
              hasBlackContainer
              padding={isMobile ? '32px 28px' : isTablet ? '44px 36px 40px' : '32px 28px'}
            >
              <SelectVault
                onChangeVault={handleChangeVault}
                defaultVault={defaultVault}
                vaults={vaults}
              />
              <form noValidate autoComplete="off">
                <div className="borrow-inputs">
                  <TextInput
                    // placeholder={borrowAmount}
                    id="borrowAmount"
                    name="borrowAmount"
                    type="number"
                    step="any"
                    value={borrowAmount}
                    onChange={value => {
                      if (Number(value) >= 0 && value.charAt(0) !== '-') {
                        setBorrowAmount(value);
                        clearErrors();
                      } else {
                        setBorrowAmount('');
                      }
                    }}
                    ref={register({
                      min: { value: 0, message: 'insufficient-borrow' },
                    })}
                    startAdornmentImage={borrowAsset.icon}
                    endAdornment={{
                      text: fixDecimal(borrowAmount * borrowAssetPrice, 2),
                      type: 'currency',
                    }}
                    subTitle="Amount to borrow"
                    description={
                      errors?.borrowAmount?.message === 'insufficient-borrow' &&
                      'Please, type the amount at least 1'
                    }
                  />
                </div>
                <div className="collateral-inputs">
                  <TextInput
                    id="collateralAmount"
                    name="collateralAmount"
                    type="number"
                    step="any"
                    placeholder={`${
                      neededCollateral
                        ? neededCollateral > 0
                          ? `min ${fixDecimal(neededCollateral, 6)}`
                          : 'No need'
                        : '...'
                    }`}
                    onChange={value => setCollateralAmount(value)}
                    ref={register({
                      required: { value: true, message: 'required-amount' },
                      min: {
                        value: neededCollateral,
                        message: 'insufficient-collateral',
                      },
                      max: { value: balance, message: 'insufficient-balance' },
                    })}
                    startAdornmentImage={collateralAsset.icon}
                    endAdornment={{
                      text: fixDecimal(collateralAmount * collateralAssetPrice, 2),
                      type: 'currency',
                    }}
                    subTitle="Collateral"
                    subTitleInfo={`${isMobile ? 'Balance' : 'Your balance'}: ${
                      balance ? fixDecimal(balance, 3) : '...'
                    }`}
                    errorComponent={
                      errors?.collateralAmount?.message === 'required-amount' ? (
                        <ErrorInputMessage>
                          Please, type the amount you want to provide as collateral
                        </ErrorInputMessage>
                      ) : errors?.collateralAmount?.message === 'insufficient-collateral' ? (
                        <ErrorInputMessage>
                          Please, provide at least{' '}
                          <span>
                            {neededCollateral ? fixDecimal(neededCollateral, 6) : '...'}{' '}
                            {collateralAsset.name}
                          </span>{' '}
                          as collateral!
                        </ErrorInputMessage>
                      ) : (
                        errors?.collateralAmount?.message === 'insufficient-balance' && (
                          <ErrorInputMessage>
                            Insufficient {collateralAsset.name} balance
                          </ErrorInputMessage>
                        )
                      )
                    }
                  />
                </div>

                <Helper>
                  Liquidity for this transaction comes from
                  <span>{` ${getActiveProviderName()}`}</span>.
                </Helper>

                <Button onClick={handleSubmit(onSubmit)} block fontWeight={600} disabled={loading}>
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
                    {getBorrowBtnContent()}
                  </Flex>
                </Button>
              </form>
            </BlackBoxContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box mr={isMobile || isTablet ? '' : '56px'}>
              <CollaterizationIndicator position={position} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {!!Cookies.get('confirm_disclaim') === false && (
        <DisclaimerPopup isOpen={!checkedClaim} onSubmit={setCheckedClaim} />
      )}
    </Container>
  );
}

export default InitBorrow;
