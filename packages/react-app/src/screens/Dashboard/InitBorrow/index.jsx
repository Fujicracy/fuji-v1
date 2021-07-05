import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatEther, parseEther, formatUnits, parseUnits } from '@ethersproject/units';
import { useForm } from 'react-hook-form';
import map from 'lodash/map';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  CircularProgress,
  DialogTitle,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { ETH_CAP_VALUE } from 'constants/providers';
import { ASSET_TYPE, ASSETS } from 'constants/assets';
import { useBalance, useContractReader, useGasPrice, useExchangePrice } from 'hooks';
import { CollaterizationIndicator, ProvidersList, HowItWorks, AlphaWarning } from 'components';
import { Transactor, getBorrowId, getCollateralId, getVaultName, GasEstimator } from 'helpers';

import './styles.css';

import { TextInput } from '../../../components/UI';

function InitBorrow({ contracts, provider, address }) {
  const { register, errors, handleSubmit, clearErrors } = useForm({ mode: 'all' });
  const queries = new URLSearchParams(useLocation().search);
  const gasPrice = useGasPrice();

  const [borrowAmount, setBorrowAmount] = useState('1000');
  const [borrowAsset, setBorrowAsset] = useState(ASSET_TYPE.DAI);

  const ethPrice = useExchangePrice();
  const borrowAssetPrice = useExchangePrice(borrowAsset);

  const [collateralAmount, setCollateralAmount] = useState('');
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProvider = useContractReader(contracts, getVaultName(borrowAsset), 'activeProvider');

  const providerAave = contracts && contracts.ProviderAave;
  const providerCompound = contracts && contracts.ProviderCompound;
  const providerDYDX = contracts && contracts.ProviderDYDX;

  const unFormattedEthBalance = useBalance(provider, address);
  const ethBalance = unFormattedEthBalance
    ? Number(formatEther(unFormattedEthBalance)).toFixed(6)
    : null;
  const { decimals } = ASSETS[borrowAsset];

  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId(borrowAsset),
  ]);

  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getBorrowId(borrowAsset),
  ]);

  const unFormattedNeededCollateral = useContractReader(
    contracts,
    getVaultName(borrowAsset),
    'getNeededCollateralFor',
    [borrowAmount ? parseUnits(borrowAmount, decimals) : '', 'true'],
  );
  const neededCollateral = unFormattedNeededCollateral
    ? Number(formatEther(unFormattedNeededCollateral))
    : null;

  const queryBorrowAmount = queries.get('borrowAmount');
  useEffect(() => {
    if (queryBorrowAmount) {
      setBorrowAmount(queryBorrowAmount);
    }
  }, [queryBorrowAmount, setBorrowAmount]);

  const queryBorrowAsset = queries.get('borrowAsset');
  useEffect(() => {
    if (queryBorrowAsset) {
      setBorrowAsset(queryBorrowAsset);
    }
  }, [queryBorrowAsset, setBorrowAsset]);

  const position = {
    borrowAsset,
    debtBalance:
      !debtBalance || !borrowAmount ? 0 : debtBalance.add(parseUnits(borrowAmount, decimals)),
    collateralBalance:
      !collateralBalance || !collateralAmount
        ? 0
        : collateralBalance.add(parseEther(collateralAmount)),
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
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'depositAndBorrow', [
      parseEther(collateralAmount),
      parseUnits(borrowAmount, decimals),
      { value: parseEther(collateralAmount), gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].depositAndBorrow(
        parseEther(collateralAmount),
        parseUnits(borrowAmount, decimals),
        { value: parseEther(collateralAmount), gasPrice, gasLimit },
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

  const handleChangeAsset = asset => () => {
    setBorrowAsset(asset);
  };

  const dialogContents = {
    success: {
      title: 'Success',
      content:
        'Your transaction has been processed, you can now check your position and follow the evolution of your debt position.',
      actions: () => (
        <DialogActions>
          <Button href="/dashboard/my-positions" className="main-button">
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
    <div className="container initial-step">
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
      <div className="left-content">
        <HowItWorks />
        <div className="dark-block borrow-actions">
          <form noValidate autoComplete="off">
            <div className="borrow-options">
              <div className="section-title">Borrow</div>
              <div className="select-options">
                <div className="options-list">
                  {map(Object.keys(ASSETS), key => {
                    const asset = ASSETS[key];
                    return (
                      <label key={key}>
                        <input
                          type="radio"
                          name="borrow"
                          value={asset.name}
                          onChange={handleChangeAsset(asset.name)}
                          checked={borrowAsset === asset.name}
                        />
                        <div className="fake-radio">
                          <img alt={asset.id} src={asset.icon} />
                          <span className="select-option-name">{asset.name}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="borrow-inputs">
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
                ref={register({ required: true, min: 0 })}
                startAdornmentImage={`/${borrowAsset}.png`}
                endAdornment={{
                  text: (borrowAmount * borrowAssetPrice).toFixed(2),
                  type: 'currency',
                }}
                subTitle="Amount to borrow"
                description={errors?.borrowAmount && 'Please, type the amount you like to borrow'}
              />

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
                startAdornmentImage="/ETH.png"
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
            <div className="helper">
              <Typography variant="body2">
                The liquidity for this transaction is coming from{' '}
                <span>
                  {!activeProvider
                    ? '...'
                    : activeProvider === providerAave.address
                    ? 'Aave'
                    : activeProvider === providerCompound.address
                    ? 'Compound'
                    : activeProvider === providerDYDX.address
                    ? 'dYdX'
                    : 'Iron Bank'}
                </span>
                .
              </Typography>
            </div>
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
        </div>
      </div>
      <div className="right-content">
        <div style={{ marginBottom: '2rem' }}>
          <AlphaWarning />
        </div>
        <CollaterizationIndicator position={position} />
        <ProvidersList contracts={contracts} markets={[borrowAsset]} />
      </div>
    </div>
  );
}

export default InitBorrow;
