import React, { useState } from 'react';
import { parseUnits } from '@ethersproject/units';
// import TextField from '@material-ui/core/TextField';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  VAULTS,
  ASSET_NAME,
  PROVIDER_TYPE,
  PROVIDERS,
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  CHAIN_NAMES,
  CHAIN_NAME,
} from 'consts';
import { Transactor, GasEstimator } from 'helpers';
import { useMediaQuery } from 'react-responsive';
import { SectionTitle } from '../../../components/Blocks';

import './styles.css';

const providerIndexes = {
  AAVE: '0', // on fantom it's Geist
  DYDX: '1',
  CREAM: '2',
};

async function getProviderIndex(vault, contracts) {
  const activeProvider = await contracts[vault.name].activeProvider();

  const ibankAddr = PROVIDERS[PROVIDER_TYPE.IRONBANK].address;
  const creamAddr = PROVIDERS[PROVIDER_TYPE.CREAM].address;

  let index = providerIndexes.AAVE;

  if (CHAIN_NAME === CHAIN_NAMES.ETHEREUM) {
    if ([ASSET_NAME.DAI, ASSET_NAME.USDC].includes(vault.borrowAsset.name)) {
      index = providerIndexes.DYDX;
    } else if (activeProvider.toLowerCase() !== ibankAddr) {
      index = providerIndexes.CREAM;
    }
  } else if (CHAIN_NAME === CHAIN_NAMES.FANTOM) {
    index =
      activeProvider.toLowerCase() === creamAddr ? providerIndexes.AAVE : providerIndexes.CREAM;
  }

  return index;
}

function FlashClose({ position, contracts, provider }) {
  const tx = Transactor(provider);

  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [amount, setAmount] = useState('');

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const vault = VAULTS[position.vaultAddress];

  const decimals = vault.borrowAsset.decimals;
  const onFlashClose = async () => {
    setLoading(true);
    const providerIndex = await getProviderIndex(vault, contracts);
    const fliquidator =
      CHAIN_NAME === CHAIN_NAMES.ETHEREUM ? contracts.Fliquidator : contracts.FliquidatorFTM;

    const gasLimit = await GasEstimator(fliquidator, 'flashClose', [
      parseUnits(amount, decimals),
      position.vaultAddress,
      providerIndex,
    ]);
    const res = await tx(
      fliquidator.flashClose(parseUnits(amount, decimals), position.vaultAddress, providerIndex, {
        gasLimit,
      }),
    );

    if (res && res.hash) {
      const receipt = await res.wait();
      if (receipt && receipt.events && receipt.events.find(e => e.event === 'FlashClose')) {
        setConfirmation(true);
      }
    }
    setLoading(false);
    setAmount('');
  };

  return (
    <>
      <Dialog open={dialog} aria-labelledby="form-dialog-title">
        <div
          className="close"
          onClick={() => {
            setDialog(false);
            setAmount('');
          }}
        >
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{confirmation ? 'Success' : 'Flash Close'}</DialogTitle>
        <DialogContent>
          {confirmation ? (
            <DialogContentText>Your transaction has been processed.</DialogContentText>
          ) : (
            <DialogContentText>
              You are about to repay your debt by selling part of your collateral. We are going to
              use a flash loan for that purpose. <br />
              <br />
              <span className="bold">Fee: 1%</span>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {confirmation ? (
            <Button
              className="main-button"
              onClick={() => {
                setDialog(false);
                setConfirmation(false);
              }}
            >
              Close
            </Button>
          ) : (
            <Button
              onClick={() => onFlashClose()}
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
              {loading ? 'Repaying...' : 'Repay'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <div className="flash-close">
        <div className="section-title">
          <SectionTitle fontSize={isMobile ? '16px' : isTablet ? '20px' : '16px'}>
            Flash Close
          </SectionTitle>
          {!isMobile && !isTablet && (
            <div className="tooltip-info">
              <InfoOutlinedIcon />
              <span className="tooltip">
                Repay your debt position from your collateral by using a flash loan. Fee: 1%
              </span>
            </div>
          )}
        </div>

        <div className="content">
          <div className="description">
            Use a flash loan to repay your debt in a single transaction.
          </div>

          <div className="actions">
            <Button
              onClick={() => {
                setDialog(true);
                setAmount('-1');
              }}
            >
              Repay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlashClose;
