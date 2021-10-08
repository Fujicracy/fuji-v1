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
  SectionTitle,
  // SectionTitle,
} from 'components';
import { TextInput } from 'components/UI';

import { VAULTS, ASSETS, PROVIDERS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import {
  Transactor,
  GasEstimator,
  CallContractFunction,
  getUserBalance,
  getExchangePrice,
  getAllowance,
} from 'helpers';
import { useBalance } from 'hooks';

import { Container, Helper } from './style';

function InitBorrow({ contracts, provider, address }) {
  const defaultVault = Object.values(VAULTS)[0];
  const queries = new URLSearchParams(useLocation().search);

  const { register, errors, handleSubmit, clearErrors } = useForm({ mode: 'all' });
  const [checkedClaim, setCheckedClaim] = useState(false);

  const [borrowAmount, setBorrowAmount] = useState(queries.get('borrowAmount') || '1000');
  const [borrowAsset, setBorrowAsset] = useState(
    queries.get('borrowAsset') || defaultVault.borrowAsset.name,
  );
  // const [market, setMarket] = useState(MARKETS[MARKET_NAMES.CORE]);
  const [vault, setVault] = useState(defaultVault);
  const [vaultAddress, setVaultAddress] = useState(Object.keys(VAULTS)[0]);
  const [collateralAsset, setCollateralAsset] = useState(defaultVault.collateralAsset.name);
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
  const [allowance, setAllowance] = useState();

  const [collateralBalance, setCollateralBalance] = useState();
  const [debtBalance, setDebtBalance] = useState();

  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (borrowAsset && collateralAsset) {
      const vaultKey = find(
        Object.keys(VAULTS),
        key =>
          VAULTS[key].borrowAsset.name === borrowAsset &&
          VAULTS[key].collateralAsset.name === collateralAsset,
      );
      setVault(VAULTS[vaultKey]);
      setVaultAddress(vaultKey);
    }
  }, [borrowAsset, collateralAsset]);

  const pollUnformatedUserBalance = useBalance(
    provider,
    address,
    contracts,
    vault.collateralAsset.name,
    vault.collateralAsset.isERC20,
  );
  useEffect(() => {
    async function fetchBalance() {
      const unFormattedBalance = await getUserBalance(
        provider,
        address,
        contracts,
        vault.collateralAsset.name,
        vault.collateralAsset.isERC20,
      );

      const formattedBalance = unFormattedBalance
        ? Number(formatUnits(unFormattedBalance, ASSETS[collateralAsset].decimals)).toFixed(6)
        : null;

      setBalance(formattedBalance);
    }

    fetchBalance();
  }, [collateralAsset, address, provider, vault, contracts, pollUnformatedUserBalance]);

  useEffect(() => {
    async function fetchAllowance() {
      setAllowance(await getAllowance(contracts, collateralAsset, [address, vaultAddress]));
    }

    fetchAllowance();
  }, [collateralAsset, address, contracts, vaultAddress]);

  useEffect(() => {
    async function fetchNeededCollateral() {
      const parsedBorrowAmount =
        borrowAmount !== '' ? parseUnits(borrowAmount, ASSETS[borrowAsset].decimals) : 0x0;

      const unFormattedNeededCollateral = await CallContractFunction(
        contracts,
        vault.name,
        'getNeededCollateralFor',
        [borrowAmount ? parsedBorrowAmount : '', 'true'],
      );
      const collateral = unFormattedNeededCollateral
        ? Number(formatUnits(unFormattedNeededCollateral, ASSETS[collateralAsset].decimals))
        : null;
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

    fetchNeededCollateral();
  }, [collateralAsset, borrowAmount, borrowAsset, contracts, vault, address, provider]);

  const position = {
    borrowAsset: ASSETS[borrowAsset],
    collateralAsset: ASSETS[collateralAsset],
    debtBalance:
      !debtBalance || !borrowAmount
        ? 0
        : debtBalance.add(parseUnits(borrowAmount, ASSETS[borrowAsset].decimals)),
    collateralBalance:
      !collateralBalance || !collateralAmount
        ? 0
        : // : collateralBalance.add(parseEther(collateralAmount)),
          collateralBalance.add(parseUnits(collateralAmount, ASSETS[collateralAsset].decimals)),
  };

  const tx = Transactor(provider);

  const borrow = async () => {
    setDialog({ step: 'borrowing', withApproval: true });

    const gasLimit = await GasEstimator(contracts[vault.name], 'depositAndBorrow', [
      parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
      parseUnits(borrowAmount, ASSETS[borrowAsset].decimals),
      {
        value: vault.collateralAsset.isERC20
          ? 0
          : parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
      },
    ]);
    const res = await tx(
      contracts[vault.name].depositAndBorrow(
        parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
        parseUnits(borrowAmount, ASSETS[borrowAsset].decimals),
        {
          value: vault.collateralAsset.isERC20
            ? 0
            : parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
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
    if (parseUnits(collateralAmount, vault.collateralAsset.decimals).eq(collateralBalance)) {
      unFormattedAmount = (Number(collateralAmount) * 1.02).toFixed(6);
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
        borrow();
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false });
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    // const totalCollateral = Number(collateralAmount) + Number(formatUnits(collateralBalance));
    // if (totalCollateral > ETH_CAP_VALUE) {
    //   setDialog({step:'capCollateral'});
    //   return;
    // }
    setLoading(true);

    if (vault.collateralAsset.isERC20) {
      if (parseUnits(collateralAmount, vault.collateralAsset.decimals).gt(allowance)) {
        setDialog({ step: 'approval', withApproval: true });
      } else {
        await borrow();
      }
      return;
    }

    await borrow();
  };

  // const handleChangeMarket = option => {
  //   setMarket(option);
  // };

  const handleChangeVault = v => {
    setNeededCollateral(null);

    setBorrowAsset(v.borrowAsset.name);
    setCollateralAsset(v.collateralAsset.name);
    setVault(v);
  };

  const getActiveProviderName = () => {
    if (!activeProvider) return '...';
    return find(Object.values(PROVIDERS), p => p.address === activeProvider.toLowerCase())?.title;
  };

  const getBorrowBtnContent = () => {
    if (vault.collateralAsset.isERC20) {
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
      content:
        'Your transaction has been processed, you can now check your position and follow the evolution of your debt position.',
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
      content: <DialogContentText>You need first to approve a spending limit.</DialogContentText>,
      actions: () => (
        <DialogActions>
          <Button onClick={() => approve(false)} className="main-button">
            Approve {Number(collateralAmount).toFixed(2)} {collateralAsset}
          </Button>
          <Button onClick={() => approve(true)} className="main-button">
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
        open={['success', 'capCollateral', 'approval'].includes(dialog.step)}
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
                  <Grid item xs={8} sm={8} md={12}>
                    <SelectMarket hasBlackContainer={false} />
                  </Grid>
                  <Grid item xs={4} sm={4} md={12}>
                    <ProvidersList
                      contracts={contracts}
                      markets={[borrowAsset]}
                      title="APR"
                      isDropDown
                      hasBlackContainer={false}
                      isSelectable={false}
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
              <SelectVault onChangeVault={handleChangeVault} defaultOption={vault} />
              <form noValidate autoComplete="off">
                <TextInput
                  // placeholder={borrowAmount}
                  id="borrowAmount"
                  name="borrowAmount"
                  type="number"
                  step="any"
                  defaultValue={borrowAmount}
                  value={borrowAmount}
                  onChange={value => {
                    setBorrowAmount(value);
                    clearErrors();
                  }}
                  ref={register({
                    required: { value: true, message: 'required-amount' },
                    min: { value: 0, message: 'insufficient-borrow' },
                  })}
                  startAdornmentImage={ASSETS[borrowAsset].icon}
                  endAdornment={{
                    text: (borrowAmount * borrowAssetPrice).toFixed(2),
                    type: 'currency',
                  }}
                  subTitle="Amount to borrow"
                  description={
                    errors?.borrowAmount?.message === 'required-amount'
                      ? 'Please, type the amount you like to borrow'
                      : errors?.borrowAmount?.message === 'insufficient-borrow' &&
                        'Please, type the amount at least 1'
                  }
                />
                <div className="borrow-inputs">
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
                    startAdornmentImage={ASSETS[collateralAsset].icon}
                    endAdornment={{
                      text: (collateralAmount * collateralAssetPrice).toFixed(2),
                      type: 'currency',
                    }}
                    subTitle="Collateral"
                    subTitleInfo={`${isMobile ? 'Balance' : 'Your balance'}: ${
                      balance ? Number(balance).toFixed(3) : '...'
                    } Ξ`}
                    errorComponent={
                      errors?.collateralAmount?.message === 'required-amount' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, type the amount you want to provide as collateral
                        </Typography>
                      ) : errors?.collateralAmount?.message === 'insufficient-collateral' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, provide at least{' '}
                          <span className="brand-color">
                            {neededCollateral.toFixed(3)} {vault.collateralAsset.name}
                          </span>{' '}
                          as collateral!
                        </Typography>
                      ) : (
                        errors?.collateralAmount?.message === 'insufficient-balance' && (
                          <Typography className="error-input-msg" variant="body2">
                            Insufficient {vault.collateralAsset.name} balance
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
                    loading ? (
                      <CircularProgress
                        style={{
                          width: 25,
                          height: 25,
                          marginRight: '10px',
                          color: 'rgba(0, 0, 0, 0.26)',
                        }}
                      />
                    ) : (
                      ''
                    )
                  }
                >
                  <SectionTitle fontSize={isTablet ? '20px' : '16px'}>
                    {getBorrowBtnContent()}
                  </SectionTitle>
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
