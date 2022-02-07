import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useAuth } from 'hooks';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { PositionRatios, getExchangePrice } from '../../../helpers';

import { CustomListItem } from './styles';

function DeltaPositionRatios({ vault, currentCollateral, currentDebt, newCollateral, newDebt }) {
  const { provider } = useAuth();
  const [healthFactor, setHealthFactor] = useState([]);
  const [borrowLimit, setLimit] = useState([]);
  const [ltv, setLtv] = useState([]);
  const [liqPrice, setLiqPrice] = useState([]);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  useEffect(() => {
    async function fetchValues() {
      const collateralAssetPrice = await getExchangePrice(provider, vault.collateralAsset);
      const borrowAssetPrice = await getExchangePrice(provider, vault.borrowAsset);

      let position = {
        vault,
        collateralBalance: currentCollateral,
        debtBalance: currentDebt,
      };
      const {
        healthFactor: oldHf,
        ltv: oldLtv,
        liqPrice: oldLiqPrice,
        borrowLimit: oldLimit,
      } = PositionRatios(position, collateralAssetPrice, borrowAssetPrice);

      position = {
        ...position,
        collateralBalance: newCollateral,
        debtBalance: newDebt,
      };
      const {
        healthFactor: newHf,
        ltv: newLtv,
        liqPrice: newLiqPrice,
        borrowLimit: newLimit,
      } = PositionRatios(position, collateralAssetPrice, borrowAssetPrice);

      setHealthFactor([oldHf, newHf]);
      setLtv([oldLtv * 100, newLtv * 100]);
      setLimit([oldLimit * 100, newLimit * 100]);
      setLiqPrice([oldLiqPrice, newLiqPrice]);
    }

    fetchValues();
  }, [vault, currentCollateral, currentDebt, newCollateral, newDebt, provider]);

  const formatValue = (value, precision) =>
    value !== undefined && value !== Infinity ? value.toFixed(precision) : '...';

  return (
    <List style={{ width: '100%' }}>
      <CustomListItem>
        <ListItemText
          primary="Health Factor"
          secondary={
            isMobile
              ? formatValue(healthFactor[0], 2) + ' -> ' + formatValue(healthFactor[1], 2)
              : ''
          }
        />
        {!isMobile && (
          <ListItemSecondaryAction>
            <Typography component="span" variant="h3">
              {formatValue(healthFactor[0], 2) + ' -> ' + formatValue(healthFactor[1], 2)}
            </Typography>
          </ListItemSecondaryAction>
        )}
      </CustomListItem>
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <CustomListItem>
        <ListItemText
          primary="Borrow Limit"
          secondary={
            isMobile
              ? formatValue(borrowLimit[0], 1) + ' % -> ' + formatValue(borrowLimit[1], 1) + ' %'
              : ''
          }
        />
        {!isMobile && (
          <ListItemSecondaryAction>
            <Typography component="span" variant="h3">
              {formatValue(borrowLimit[0], 1) + ' % -> ' + formatValue(borrowLimit[1], 1) + ' %'}
            </Typography>
          </ListItemSecondaryAction>
        )}
      </CustomListItem>
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <CustomListItem>
        <ListItemText
          primary="Loan-to-Value"
          secondary={
            isMobile ? formatValue(ltv[0], 1) + ' % -> ' + formatValue(ltv[1], 1) + ' %' : ''
          }
        />
        {!isMobile && (
          <ListItemSecondaryAction>
            <Typography component="span" variant="h3">
              {formatValue(ltv[0], 1) + ' % -> ' + formatValue(ltv[1], 1) + ' %'}
            </Typography>
          </ListItemSecondaryAction>
        )}
      </CustomListItem>
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <CustomListItem>
        <ListItemText
          primary={`${vault.collateralAsset.name} liquidation price`}
          secondary={
            isMobile
              ? '$' + formatValue(liqPrice[0], 2) + ' -> $' + formatValue(liqPrice[1], 2)
              : ''
          }
        />
        {!isMobile && (
          <ListItemSecondaryAction>
            <Typography component="span" variant="h3">
              {'$' + formatValue(liqPrice[0], 2) + ' -> $' + formatValue(liqPrice[1], 2)}
            </Typography>
          </ListItemSecondaryAction>
        )}
      </CustomListItem>
    </List>
  );
}

export default DeltaPositionRatios;
