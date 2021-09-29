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
import { VAULTS, ASSET_NAME, PROVIDERS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Transactor, GasEstimator } from 'helpers';
import { useMediaQuery } from 'react-responsive';
import { SectionTitle } from '../../../components/Blocks';

import './styles.css';

async function getLiquidationProviderIndex(vault, contracts) {
  const providerIndex = {
    aave: '0',
    dydx: '1',
    cream: '2',
  };
  const activeProvider = await contracts[vault.name].activeProvider();
  const dydxProviderAddr = PROVIDERS.DYDX.address;

  if (
    [ASSET_NAME.DAI, ASSET_NAME.USDC].includes(vault.borrowAsset.name) &&
    activeProvider !== dydxProviderAddr
  ) {
    return providerIndex.dydx;
  }
  return providerIndex.cream;
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
    const providerIndex = await getLiquidationProviderIndex(vault, contracts);

    const gasLimit = await GasEstimator(contracts.Fliquidator, 'flashClose', [
      parseUnits(amount, decimals),
      position.vaultAddress,
      providerIndex,
    ]);
    const res = await tx(
      contracts.Fliquidator.flashClose(
        parseUnits(amount, decimals),
        position.vaultAddress,
        providerIndex,
        { gasLimit },
      ),
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
            <DialogContentText>Your transaction have been processed.</DialogContentText>
          ) : (
            <DialogContentText>
              You are about to repay your debt position with your collateral. We are going to use a
              flash loan for that purpose. <br />
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
