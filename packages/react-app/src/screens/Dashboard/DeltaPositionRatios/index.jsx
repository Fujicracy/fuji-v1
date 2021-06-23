import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { ASSETS } from 'constants/assets';

import { PositionRatios } from '../../../helpers';
import { useExchangePrice } from '../../../hooks';

function DeltaPositionRatios({
  borrowAsset,
  currentCollateral,
  currentDebt,
  newCollateral,
  newDebt,
}) {
  const price = useExchangePrice();

  const [healthFactor, setHealthFactor] = useState([]);
  const [borrowLimit, setLimit] = useState([]);
  const [ltv, setLtv] = useState([]);

  useEffect(() => {
    let position = {
      borrowAsset,
      collateralBalance: currentCollateral,
      debtBalance: currentDebt,
      decimals: ASSETS.find(asset => asset.name === borrowAsset).decimals,
    };
    const {
      healthFactor: oldHf,
      ltv: oldLtv,
      borrowLimit: oldLimit,
    } = PositionRatios(position, price);

    position = {
      ...position,
      collateralBalance: newCollateral,
      debtBalance: newDebt,
    };
    const {
      healthFactor: newHf,
      ltv: newLtv,
      borrowLimit: newLimit,
    } = PositionRatios(position, price);

    setHealthFactor([oldHf, newHf]);
    setLtv([oldLtv * 100, newLtv * 100]);
    setLimit([oldLimit * 100, newLimit * 100]);
  }, [price, borrowAsset, currentCollateral, currentDebt, newCollateral, newDebt]);

  const formatValue = (value, precision) =>
    value !== undefined && value !== Infinity ? value.toFixed(precision) : '...';

  return (
    <List style={{ width: '100%' }}>
      <ListItem alignItems="flex-start">
        <ListItemText primary="Health Factor" />
        <ListItemSecondaryAction>
          <Typography component="span" variant="h3">
            {formatValue(healthFactor[0], 2) + ' -> ' + formatValue(healthFactor[1], 2)}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <ListItem alignItems="flex-start">
        <ListItemText primary="Borrow Limit" />
        <ListItemSecondaryAction>
          <Typography component="span" variant="h3">
            {formatValue(borrowLimit[0], 1) + ' % -> ' + formatValue(borrowLimit[1], 1) + ' %'}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <ListItem alignItems="flex-start">
        <ListItemText primary="Loan-to-Value" />
        <ListItemSecondaryAction>
          <Typography component="span" variant="h3">
            {formatValue(ltv[0], 1) + ' % -> ' + formatValue(ltv[1], 1) + ' %'}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

export default DeltaPositionRatios;
