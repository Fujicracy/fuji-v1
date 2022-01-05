import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useAuth } from 'hooks';
import { PositionRatios, getExchangePrice } from '../../../helpers';

function DeltaPositionRatios({ vault, currentCollateral, currentDebt, newCollateral, newDebt }) {
  const { provider } = useAuth();
  const [healthFactor, setHealthFactor] = useState([]);
  const [borrowLimit, setLimit] = useState([]);
  const [ltv, setLtv] = useState([]);
  const [liqPrice, setLiqPrice] = useState([]);

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
      <Divider component="li" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <ListItem alignItems="flex-start">
        <ListItemText primary={`${vault.collateralAsset.name} liquidation price`} />
        <ListItemSecondaryAction>
          <Typography component="span" variant="h3">
            {'$ ' + formatValue(liqPrice[0], 2) + ' -> $ ' + formatValue(liqPrice[1], 2)}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

export default DeltaPositionRatios;
