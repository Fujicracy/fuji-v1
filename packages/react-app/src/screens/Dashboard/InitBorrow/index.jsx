import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { ETH_CAP_VALUE } from 'consts/providers';
import { ASSETS, ASSET_NAME } from 'consts/assets';
import { useBalance, useContractReader, useGasPrice, useExchangePrice } from 'hooks';
import {
  CollaterizationIndicator,
  ProvidersList,
  HowItWorks,
  DisclaimerPopup,
  SelectVault,
} from 'components';
import { CustomList, TextInput } from 'components/UI';
import { NETWORKS, NETWORK_NAME } from 'consts/networks';
import { Transactor, getBorrowId, getCollateralId, getVaultName, GasEstimator } from 'helpers';
import './styles.css';

function InitBorrow({ contracts, provider, address }) {
  const { register, errors, handleSubmit, clearErrors } = useForm({ mode: 'all' });
  const [checkedClaim, setCheckedClaim] = useState(false);
  const queries = new URLSearchParams(useLocation().search);
  const queryBorrowAsset = queries.get('borrowAsset');
  const queryBorrowAmount = queries.get('borrowAmount');

  const gasPrice = useGasPrice();

  const [borrowAmount, setBorrowAmount] = useState(queryBorrowAmount || '1000');
  const [borrowAsset, setBorrowAsset] = useState(queryBorrowAsset || ASSET_NAME.DAI);
  const [network, setNetwork] = useState(NETWORKS[NETWORK_NAME.ETH]);

  const [collateralAsset, setCollateralAsset] = useState(ASSET_NAME.ETH);
  const [collateralAmount, setCollateralAmount] = useState('');

  const ethPrice = useExchangePrice();
  const borrowAssetPrice = useExchangePrice(borrowAsset);
  // const collateralAssetPrice = useExchangePrice(collateralAsset);
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProvider = useContractReader(contracts, getVaultName(borrowAsset), 'activeProvider');

  const providerAave = contracts && contracts.ProviderAave;
  const providerCompound = contracts && contracts.ProviderCompound;
  const providerDYDX = contracts && contracts.ProviderDYDX;

  const unFormattedEthBalance = useBalance(provider, address);
  const ethBalance = unFormattedEthBalance
    ? Number(formatUnits(unFormattedEthBalance, ASSETS[collateralAsset].decimals)).toFixed(6)
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
    ? Number(formatUnits(unFormattedNeededCollateral, ASSETS[collateralAsset].decimals))
    : null;

  const position = {
    borrowAsset: ASSETS[borrowAsset],
    collateralAsset: ASSETS[ASSET_NAME.ETH],
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
    const gasLimit = await GasEstimator(contracts[getVaultName(borrowAsset)], 'depositAndBorrow', [
      parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
      parseUnits(borrowAmount, decimals),
      { value: parseUnits(collateralAmount, ASSETS[collateralAsset].decimals), gasPrice },
    ]);
    const res = await tx(
      contracts[getVaultName(borrowAsset)].depositAndBorrow(
        parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
        parseUnits(borrowAmount, decimals),
        {
          value: parseUnits(collateralAmount, ASSETS[collateralAsset].decimals),
          gasPrice,
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

  const handleChangeVault = vault => {
    setBorrowAsset(vault.borrowAsset.name);
    setCollateralAsset(vault.collateralAsset.name);
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

  console.log({ network, borrowAsset, collateralAsset });
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
        <CustomList
          title="Networks"
          handleChange={handleChangeNetwork}
          options={NETWORKS}
          defaultOption={NETWORKS.ETH}
        />
        <ProvidersList contracts={contracts} markets={[borrowAsset]} isDropDown={false} />
      </div>

      <div className="center-content">
        <HowItWorks />
        <div className="dark-block borrow-actions">
          <SelectVault onChangeVault={handleChangeVault} />
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
              ref={register({ required: true, min: 0 })}
              startAdornmentImage={ASSETS[borrowAsset].image}
              endAdornment={{
                text: (borrowAmount * borrowAssetPrice).toFixed(2),
                type: 'currency',
              }}
              subTitle="Amount to borrow"
              description={errors?.borrowAmount && 'Please, type the amount you like to borrow'}
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
                startAdornmentImage={ASSETS[collateralAsset].image}
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
        <CollaterizationIndicator position={position} />
      </div>
      {!!Cookies.get('confirm_disclaim') === false && (
        <DisclaimerPopup isOpen={!checkedClaim} onSubmit={setCheckedClaim} />
      )}
    </div>
  );
}

export default InitBorrow;
