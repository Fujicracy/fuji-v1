import React, { useEffect, useState } from 'react';
import { formatEther, parseEther, formatUnits, parseUnits } from '@ethersproject/units';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Grid,
  Avatar,
  Typography,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { Flex } from 'rebass';
import { Button } from 'components';
import { Transactor } from 'helpers';
import { useAuth, useBalance, useContractLoader, useContractReader } from 'hooks';
import { ETH_CAP_VALUE } from 'consts/globals';
import { VAULTS } from 'consts';
import { ethIcons } from 'assets/images';

function SupplyAndBorrowForm({ position }) {
  const { address, provider } = useAuth();
  const contracts = useContractLoader(provider);

  const { register, errors, handleSubmit } = useForm();
  const tx = Transactor(provider);

  const vault = VAULTS[position.vaultAddress];
  const decimals = vault.borrowAsset.decimals;

  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [formattedCollateral, setFormattedCollateral] = useState(0);
  const [dialog, setDialog] = useState('');
  const [loading, setLoading] = useState(false);

  const ethBalance = useBalance(provider, address);

  const collateralBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.collateralId,
  ]);
  const debtBalance = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    vault.borrowId,
  ]);

  const neededCollateral = useContractReader(contracts, vault.name, 'getNeededCollateralFor', [
    borrowAmount ? parseUnits(`${borrowAmount}`, decimals).add(debtBalance || '0') : '',
    'true',
  ]);

  useEffect(() => {
    if (neededCollateral) {
      const f = parseFloat(formatUnits(neededCollateral) * 1.02).toFixed(3);
      setFormattedCollateral(f);
    }
  }, [neededCollateral]);

  const onSubmit = async () => {
    const totalCollateral = Number(collateralAmount) + Number(formatUnits(collateralBalance));
    if (totalCollateral > ETH_CAP_VALUE) {
      setDialog('capCollateral');
      return;
    }
    setLoading(true);
    const res = await tx(
      contracts[vault.name].depositAndBorrow(
        parseEther(collateralAmount),
        parseUnits(borrowAmount, decimals),
        { value: parseEther(collateralAmount) },
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

  const resetForm = () => {
    setDialog('');
    setLoading(false);
    setBorrowAmount('');
    setCollateralAmount('');
  };

  const dialogContents = {
    success: {
      title: 'Transaction success',
      content: 'Your transaction has been processed',
      actions: () => (
        <DialogActions>
          <Button block noResizeOnResponsive onClick={() => resetForm()}>
            Close
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
    <Grid container direction="column">
      <Dialog
        open={dialog === 'success' || dialog === 'capCollateral'}
        aria-labelledby="form-dialog-title"
      >
        <div className="close" onClick={() => resetForm()}>
          <HighlightOffIcon />
        </div>
        <DialogTitle id="form-dialog-title">{dialogContents[dialog]?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContents[dialog]?.content}</DialogContentText>
        </DialogContent>
        {dialogContents[dialog]?.actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">Supply & Borrow</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Supply</span> more collateral and
            <span className="bold"> borrow</span> {vault.borrowAsset.name} in a single transaction.
          </span>
        </div>
      </Grid>
      <Grid item>
        <div className="subtitle">
          <span className="complementary-infos">
            Your balance: {ethBalance ? parseFloat(formatEther(ethBalance)).toFixed(2) : '...'} ETH
            Ξ
          </span>
        </div>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="collateralAmount"
            type="number"
            step="any"
            id="supplyAmount"
            variant="outlined"
            onChange={({ target }) => setCollateralAmount(target.value)}
            inputRef={register({ required: true, min: formattedCollateral })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="ETH" src={ethIcons.BLUE} className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    ETH
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.collateralAmount && (
          <Typography className="error-input-msg" variant="body2">
            Please, provide at least <span className="brand-color">{formattedCollateral} ETH</span>{' '}
            as collateral!
          </Typography>
        )}
      </Grid>
      <Grid item>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            id="borrowAmount"
            name="borrowAmount"
            type="number"
            step="any"
            variant="outlined"
            onChange={({ target }) => setBorrowAmount(target.value)}
            inputRef={register({ required: true, min: 0 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar
                    alt={vault.borrowAsset.name}
                    src={vault.borrowAsset.icon}
                    className="icon"
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    {vault.borrowAsset.name}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {errors?.borrowAmount && (
          <Typography className="error-input-msg" variant="body2">
            Please, type the amount you like to borrow!
          </Typography>
        )}
      </Grid>
      <Grid item>
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
            {loading ? 'Processing...' : 'Submit'}
          </Flex>
        </Button>
      </Grid>
    </Grid>
  );
}

export default SupplyAndBorrowForm;
