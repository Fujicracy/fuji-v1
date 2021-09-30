import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { formatUnits, parseUnits } from '@ethersproject/units';
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
import { ETH_CAP_VALUE } from 'consts/globals';
import { useBalance, useContractReader, useExchangePrice } from 'hooks';
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
// import { MARKETS, MARKET_NAMES } from 'consts/markets';
import { Transactor, GasEstimator } from 'helpers';
import { useMediaQuery } from 'react-responsive';
import find from 'lodash/find';
import { Container, Helper } from './style';

function InitBorrow({ contracts, provider, address }) {
  const defaultVault = Object.values(VAULTS)[0];

  const { register, errors, handleSubmit, clearErrors } = useForm({ mode: 'all' });
  const [checkedClaim, setCheckedClaim] = useState(false);
  const queries = new URLSearchParams(useLocation().search);
  const queryBorrowAsset = queries.get('borrowAsset');
  const queryBorrowAmount = queries.get('borrowAmount');

  const [borrowAmount, setBorrowAmount] = useState(queryBorrowAmount || '1000');
  const [borrowAsset, setBorrowAsset] = useState(queryBorrowAsset || defaultVault.borrowAsset.name);
  // const [market, setMarket] = useState(MARKETS[MARKET_NAMES.CORE]);
  const [vault, setVault] = useState(defaultVault);

  const [collateralAsset, setCollateralAsset] = useState(defaultVault.collateralAsset.name);
  const [collateralAmount, setCollateralAmount] = useState('');
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => {
    if (borrowAsset && collateralAsset) {
      const vaultKey = find(
        Object.keys(VAULTS),
        key =>
          VAULTS[key].borrowAsset.name === borrowAsset &&
          VAULTS[key].collateralAsset.name === collateralAsset,
      );
      setVault(VAULTS[vaultKey]);
    }
  }, [borrowAsset, collateralAsset]);

  useEffect(() => {
    if (vault.isCollateralERC20) setBorrowAmount('1');
    else setBorrowAmount('1000');
  }, [vault]);

  const borrowAssetPrice = useExchangePrice(borrowAsset);
  const collateralAssetPrice = useExchangePrice(collateralAsset);
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProvider = useContractReader(contracts, vault.name, 'activeProvider');

  const unFormattedBalance = useBalance(
    provider,
    address,
    contracts,
    vault.collateralAsset.name,
    vault.isCollateralERC20,
    1000,
  );
  const balance = unFormattedBalance
    ? Number(formatUnits(unFormattedBalance, ASSETS[collateralAsset].decimals)).toFixed(6)
    : null;

  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.collateralId,
  ]);

  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.borrowId,
  ]);

  const unFormattedNeededCollateral = useContractReader(
    contracts,
    vault.name,
    'getNeededCollateralFor',
    [borrowAmount ? parseUnits(borrowAmount, ASSETS[borrowAsset].decimals) : '', 'true'],
  );

  const neededCollateral = unFormattedNeededCollateral
    ? Number(formatUnits(unFormattedNeededCollateral, ASSETS[collateralAsset].decimals))
    : null;

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
  const onSubmit = async () => {
    const totalCollateral = Number(collateralAmount) + Number(formatUnits(collateralBalance));
    if (totalCollateral > ETH_CAP_VALUE) {
      setDialog('capCollateral');
      return;
    }

    setLoading(true);
    const gasLimit = await GasEstimator(contracts[vault.name], 'depositAndBorrow', [
      parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
      parseUnits(borrowAmount, ASSETS[borrowAsset].decimals),
      { value: parseUnits(collateralAmount, ASSETS[collateralAsset].decimals) },
    ]);
    const res = await tx(
      contracts[vault.name].depositAndBorrow(
        parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
        parseUnits(borrowAmount, ASSETS[borrowAsset].decimals),
        {
          value: parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
          gasLimit,
        },
      ),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'Borrow')) {
        setDialog('success');
      }
    }
    setLoading(false);
  };

  // const handleChangeMarket = option => {
  //   setMarket(option);
  // };

  const handleChangeVault = v => {
    setBorrowAsset(v.borrowAsset.name);
    setCollateralAsset(v.collateralAsset.name);
    setVault(v);
  };

  const getActiveProviderName = () => {
    if (!activeProvider) return '...';
    return find(Object.values(PROVIDERS), p => p.address === activeProvider.toLowerCase())?.title;
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
    capCollateral: {
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
      ),
    },
  };

  return (
    <Container>
      <Dialog
        open={dialog === 'success' || dialog === 'capCollateral'}
        aria-labelledby="form-dialog-title"
      >
        <div
          className="close"
          onClick={() => {
            setDialog('');
            setLoading(false);
          }}
        >
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContents[dialog]?.content}</DialogContentText>
        </DialogContent>
        {dialogContents[dialog]?.actions()}
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
                    <SelectMarket
                      /* handleChange={handleChangeMarket} */ hasBlackContainer={false}
                    />
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
                  placeholder={borrowAmount}
                  id="borrowAmount"
                  name="borrowAmount"
                  type="number"
                  step="any"
                  defaultValue={borrowAmount}
                  value={borrowAmount}
                  onChange={({ target }) => {
                    setBorrowAmount(target.value);
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
                    onChange={({ target }) => setCollateralAmount(target.value)}
                    ref={register({
                      required: { value: true, message: 'required-amount' },
                      min: { value: neededCollateral, message: 'insufficient-collateral' },
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
                {/* <SectionTitle mb={isMobile ? 3 : 4} fontSize={isMobile ? 0 : 1}> */}

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
                    Borrow{loading ? 'ing...' : ''}
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
