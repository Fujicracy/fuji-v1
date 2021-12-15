import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Box } from 'rebass';
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
} from 'components';
import { TextInput } from 'components/UI';

import { PROVIDERS, BREAKPOINTS, BREAKPOINT_NAMES, CHAIN_NAMES, ASSET_NAME } from 'consts';
import {
  Transactor,
  GasEstimator,
  CallContractFunction,
  getUserBalance,
  getExchangePrice,
} from 'helpers';
import { useAuth, useBalance, useAllowance, useResources, useContractLoader } from 'hooks';

import { Container, Helper } from './style';

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

  const [borrowAssetPrice, setBorrowAssetPrice] = useState(0);
  const [collateralAssetPrice, setCollateralAssetPrice] = useState(0);

  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);
  const [neededCollateral, setNeededCollateral] = useState(null);

  const [activeProvider, setActiveProvider] = useState('');

  const [collateralBalance, setCollateralBalance] = useState();
  const [debtBalance, setDebtBalance] = useState();

  const [balance, setBalance] = useState(null);

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

  useEffect(() => {
    async function fetchBalance() {
      const unFormattedBalance = await getUserBalance(
        provider,
        address,
        contracts,
        collateralAsset.name,
        collateralAsset.isERC20,
      );
      const formattedBalance = unFormattedBalance
        ? Number(formatUnits(unFormattedBalance, collateralAsset.decimals)).toFixed(6)
        : null;

      setBalance(formattedBalance);
    }

    fetchBalance();
  }, [collateralAsset, address, provider, contracts, pollUnformatedUserBalance]);

  useEffect(() => {
    async function fetchDatas() {
      const parsedBorrowAmount =
        borrowAmount !== '' ? parseUnits(borrowAmount, borrowAsset.decimals) : 0x0;

      const unFormattedNeededCollateral = await CallContractFunction(
        contracts,
        vault.name,
        'getNeededCollateralFor',
        [borrowAmount ? parsedBorrowAmount : '', 'true'],
      );
      const collateral = unFormattedNeededCollateral
        ? Number(formatUnits(unFormattedNeededCollateral, collateralAsset.decimals))
        : 0;
      setNeededCollateral(collateral);

      setActiveProvider(await CallContractFunction(contracts, vault.name, 'activeProvider'));

      setCollateralBalance(
        await CallContractFunction(contracts, 'FujiERC1155', 'balanceOf', [
          address,
          vault.collateralId,
        ]),
      );

      setDebtBalance(
        await CallContractFunction(contracts, 'FujiERC1155', 'balanceOf', [
          address,
          vault.borrowId,
        ]),
      );

      setCollateralAssetPrice(await getExchangePrice(provider, collateralAsset));
      setBorrowAssetPrice(await getExchangePrice(provider, borrowAsset));
    }

    if (contracts && vault) fetchDatas();
  }, [collateralAsset, borrowAmount, borrowAsset, contracts, vault, address, provider, loading]);

  const position = {
    vault: vault ?? defaultVault,
    debtBalance:
      !debtBalance || !borrowAmount
        ? 0
        : debtBalance.add(parseUnits(borrowAmount, borrowAsset.decimals)),
    collateralBalance:
      !collateralBalance || !collateralAmount
        ? 0
        : collateralBalance.add(parseUnits(collateralAmount, collateralAsset.decimals)),
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
      unFormattedAmount = (Number(collateralAmount) * 1.02).toFixed(6);
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
      if (totalCollateral > ETH_CAP_VALUE && collateralAsset.name === ASSET_NAME.ETH) {
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
    setNeededCollateral(0);

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
          <Button component={Link} to="/dashboard/my-positions" className="main-button">
            Check my positions
          </Button>
        </DialogActions>
      ),
    },
    approval: {
      title: 'Approving... 1 of 2',
      content: 'You need first to approve a spending limit.',
      actions: () => (
        <>
          <DialogActions>
            <Button onClick={() => approve(false)} className="main-button">
              Approve {Number(collateralAmount).toFixed(3)} {collateralAsset.name}
            </Button>
          </DialogActions>
          <DialogActions>
            <Button onClick={() => approve(true)} className="main-button">
              Infinite Approve
            </Button>
          </DialogActions>
        </>
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
            className="main-button"
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
            className="main-button"
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
        width={isMobile ? '320px' : isTablet ? '420px' : '1200px'}
        margin={isMobile ? '32px 28px' : isTablet ? '36px 176px' : '24px 160px'}
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
                      text: (borrowAmount * borrowAssetPrice).toFixed(2),
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
                    placeholder={`min ${neededCollateral ? neededCollateral.toFixed(3) : '...'}`}
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
                      text: (collateralAmount * collateralAssetPrice).toFixed(2),
                      type: 'currency',
                    }}
                    subTitle="Collateral"
                    subTitleInfo={`${isMobile ? 'Balance' : 'Your balance'}: ${
                      balance ? Number(balance).toFixed(3) : '...'
                    }`}
                    errorComponent={
                      errors?.collateralAmount?.message === 'required-amount' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, type the amount you want to provide as collateral
                        </Typography>
                      ) : errors?.collateralAmount?.message === 'insufficient-collateral' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, provide at least{' '}
                          <span className="brand-color">
                            {neededCollateral ? neededCollateral.toFixed(3) : '...'}{' '}
                            {collateralAsset.name}
                          </span>{' '}
                          as collateral!
                        </Typography>
                      ) : (
                        errors?.collateralAmount?.message === 'insufficient-balance' && (
                          <Typography className="error-input-msg" variant="body2">
                            Insufficient {collateralAsset.name} balance
                          </Typography>
                        )
                      )
                    }
                  />
                </div>

                <Helper>
                  Liquidity for this transaction comes from
                  <span>{` ${getActiveProviderName()}`}</span>.
                </Helper>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="main-button"
                  disabled={loading}
                  startIcon={
                    loading && (
                      <CircularProgress
                        style={{
                          width: 25,
                          height: 25,
                          marginRight: '10px',
                          color: 'rgba(0, 0, 0, 0.26)',
                        }}
                      />
                    )
                  }
                >
                  {getBorrowBtnContent()}
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
