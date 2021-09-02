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
  // SectionTitle,
} from 'components';
import { TextInput } from 'components/UI';

import { VAULTS, ASSETS, PROVIDERS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { NETWORKS, NETWORK_NAME } from 'consts/networks';
import { Transactor, GasEstimator } from 'helpers';
import map from 'lodash/map';
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
  const [network, setNetwork] = useState(NETWORKS[NETWORK_NAME.ETH]);
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
      map(Object.keys(VAULTS), key => {
        if (
          VAULTS[key].borrowAsset.name === borrowAsset &&
          VAULTS[key].collateralAsset.name === collateralAsset
        ) {
          setVault(VAULTS[key]);
          console.log('SETTING:', VAULTS[key]);
        }
      });
    }
  }, [borrowAsset, collateralAsset]);

  const ethPrice = useExchangePrice();
  const borrowAssetPrice = useExchangePrice(borrowAsset);
  // const collateralAssetPrice = useExchangePrice(collateralAsset);
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProvider = useContractReader(contracts, vault.name, 'activeProvider');

  const unFormattedEthBalance = useBalance(provider, address);
  const ethBalance = unFormattedEthBalance
    ? Number(formatUnits(unFormattedEthBalance, ASSETS[collateralAsset].decimals)).toFixed(6)
    : null;
  const { decimals } = ASSETS[borrowAsset];

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
    [borrowAmount ? parseUnits(borrowAmount, decimals) : '', 'true'],
  );
  const neededCollateral = unFormattedNeededCollateral
    ? Number(formatUnits(unFormattedNeededCollateral, ASSETS[collateralAsset].decimals))
    : null;

  const position = {
    borrowAsset: ASSETS[borrowAsset],
    collateralAsset: ASSETS[collateralAsset],
    debtBalance:
      !debtBalance || !borrowAmount ? 0 : debtBalance.add(parseUnits(borrowAmount, decimals)),
    collateralBalance:
      !collateralBalance || !collateralAmount
        ? 0
        : // : collateralBalance.add(parseEther(collateralAmount)),
          collateralBalance.add(parseUnits(collateralAmount, ASSETS[collateralAsset].decimals)),
    decimals,
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
      parseUnits(borrowAmount, decimals),
      { value: parseUnits(collateralAmount, ASSETS[collateralAsset].decimals) },
    ]);
    const res = await tx(
      contracts[vault.name].depositAndBorrow(
        parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
        parseUnits(borrowAmount, decimals),
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

  const handleChangeNetwork = option => {
    setNetwork(option);
  };

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

  console.log({ network, errors: errors?.borrowAmount?.message, isTablet });
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
      <Box maxWidth="90rem" padding={isMobile ? '32px 28px' : isTablet ? '40px 128px' : '32px'}>
        <Grid container spacing={isMobile ? 4 : isTablet ? 4 : 6}>
          <Grid item xs={12} sm={12} md={4}>
            <Box ml={isMobile || isTablet ? '' : '56px'}>
              {!isMobile && !isTablet && <HowItWorks />}
              <BlackBoxContainer hasBlackContainer padding="32px 28px">
                <Grid container spacing={isMobile ? 4 : 4}>
                  <Grid item xs={8} sm={7} md={12}>
                    <SelectMarket
                      title="Networks"
                      handleChange={handleChangeNetwork}
                      options={NETWORKS}
                      defaultOption={NETWORKS.ETH}
                      hasBlackContainer={false}
                    />
                  </Grid>
                  <Grid item xs={4} sm={5} md={12}>
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
            <BlackBoxContainer hasBlackContainer padding="32px 28px">
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
                    min: { value: 1, message: 'insufficient-borrow' },
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
                      max: { value: ethBalance, message: 'insufficient-balance' },
                    })}
                    startAdornmentImage={ASSETS[collateralAsset].icon}
                    endAdornment={{
                      text: (collateralAmount * ethPrice).toFixed(2),
                      type: 'currency',
                    }}
                    subTitle="Collateral"
                    subTitleInfo={`Your balance: ${
                      ethBalance ? Number(ethBalance).toFixed(3) : '...'
                    } Ξ`}
                    errorComponent={
                      errors?.collateralAmount?.message === 'required-amount' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, type the amount you want to provide as collateral
                        </Typography>
                      ) : errors?.collateralAmount?.message === 'insufficient-collateral' ? (
                        <Typography className="error-input-msg" variant="body2">
                          Please, provide at least{' '}
                          <span className="brand-color">{neededCollateral.toFixed(3)} ETH</span> as
                          collateral!
                        </Typography>
                      ) : (
                        errors?.collateralAmount?.message === 'insufficient-balance' && (
                          <Typography className="error-input-msg" variant="body2">
                            Insufficient ETH balance
                          </Typography>
                        )
                      )
                    }
                  />
                </div>
                {/* <SectionTitle mb={isMobile ? 3 : 4} fontSize={isMobile ? 0 : 1}> */}

                <Helper mb={3} mt={-2}>
                  The liquidity for this transaction is coming from{' '}
                  <span>{getActiveProviderName()}</span>.
                </Helper>
                <div>
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
                    Borrow{loading ? 'ing...' : ''}
                  </Button>
                </div>
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
