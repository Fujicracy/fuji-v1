import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatUnits } from '@ethersproject/units';
import { Grid } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { Image, Flex } from 'rebass';
import { SectionTitle } from 'components/Blocks';

import { useExchangePrice } from '../../hooks';
import { PositionRatios } from '../../helpers';
import { ManageButton } from './styles';

export const PositionActions = {
  None: 0,
  Manage: 1,
  Liquidate: 2,
};

function hsl(r) {
  const hue = (r / 100) * 120;
  return `hsl(${Math.min(hue, 120)}, 100%, 50%)`;
}

function logslider(value) {
  if (value < 1) {
    return 0;
  }
  if (value >= 1 && value <= 2) {
    return 50 * value - 50;
  }
  const constant = 50 * Math.log10(2);
  return 100 - constant / Math.log10(value);
}

function PositionElement({ position, actionType }) {
  const { vault, debtBalance, collateralBalance } = position;
  const { borrowAsset, collateralAsset } = vault;

  const history = useHistory();
  const collateralAssetPrice = useExchangePrice(collateralAsset);
  const borrowAssetPrice = useExchangePrice(borrowAsset);

  const [healthFactor, setHealthFactor] = useState(0);
  const [healthRatio, setHealthRatio] = useState(0);

  const debt = debtBalance ? Number(formatUnits(debtBalance, borrowAsset.decimals)) : null;
  const collateral = collateralBalance
    ? Number(formatUnits(collateralBalance, collateralAsset.decimals))
    : null;

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => {
    const ratios = PositionRatios(position, collateralAssetPrice, borrowAssetPrice);

    setHealthFactor(ratios.healthFactor);
    const hr = logslider(ratios.healthFactor);
    setHealthRatio(hr);
  }, [collateralAssetPrice, borrowAssetPrice, position]);

  const isShowManage = !isMobile && !isTablet && actionType === PositionActions.Manage;
  return (
    <Grid container alignItems="center">
      <Grid item xs={4} md={isShowManage ? 3 : 4}>
        <Flex alignItems="center" justifyContent="flex-start">
          <Flex>
            <Image
              alt={collateralAsset.name}
              src={collateralAsset.icon}
              width={isMobile ? 16 : isTablet ? 24 : 24}
            />
            <Image
              alt={borrowAsset.name}
              src={borrowAsset.icon}
              width={isMobile ? 16 : isTablet ? 24 : 24}
              ml={isMobile || isTablet ? -1 : -2}
            />
          </Flex>
          {/* <span className="elmt-name">
          {collateralAsset.name}/{borrowAsset.name}
        </span> */}
          <SectionTitle
            fontWeight="500"
            fontSize={isMobile ? '12px' : isTablet ? '18px' : '16px'}
            ml={2}
          >
            {collateralAsset.name}/{borrowAsset.name}
          </SectionTitle>
        </Flex>
      </Grid>

      <Grid item xs={8} md={isShowManage ? 7 : 8}>
        <Flex flexDirection="row" width={1 / 1}>
          <Flex
            flexDirection="column"
            sx={{ width: '30%' }}
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              flexDirection={isMobile || isTablet ? 'column' : 'row'}
              justifyContent="center"
              alignItems="center"
            >
              <Image
                alt={collateralAsset.name}
                src={collateralAsset.icon}
                width={isMobile ? 16 : isTablet ? 24 : 24}
              />
              <SectionTitle
                fontWeight="500"
                fontSize={isMobile ? '10px' : isTablet ? '18px' : '16px'}
                mt={isMobile || isTablet ? 2 : 0}
                ml={!isMobile && !isTablet ? 2 : 0}
              >
                {collateral ? collateral.toFixed(3) : '...'}
              </SectionTitle>
            </Flex>
            {!isMobile && !isTablet && (
              <SectionTitle mt={2}>
                ≈ $
                {collateral && collateralAssetPrice
                  ? (collateral * collateralAssetPrice).toFixed(2)
                  : '...'}
              </SectionTitle>
            )}
          </Flex>

          <Flex
            flexDirection="column"
            sx={{ width: '30%' }}
            justifyContent="center"
            alignItems="center"
          >
            <Flex
              flexDirection={isMobile || isTablet ? 'column' : 'row'}
              justifyContent="center"
              alignItems="center"
            >
              <Image
                alt={borrowAsset.name}
                src={borrowAsset.icon}
                width={isMobile ? 16 : isTablet ? 24 : 24}
              />
              <SectionTitle
                fontWeight="500"
                fontSize={isMobile ? '10px' : isTablet ? '18px' : '16px'}
                mt={isMobile || isTablet ? 2 : 0}
                ml={!isMobile && !isTablet ? 2 : 0}
              >
                {debt ? debt.toFixed(3) : '...'}
              </SectionTitle>
            </Flex>
            {!isMobile && !isTablet && (
              <SectionTitle mt={2}>
                ≈ ${debt ? (debt * borrowAssetPrice).toFixed(2) : '...'}
              </SectionTitle>
            )}
          </Flex>

          <Flex
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={hsl(healthRatio)}
            fontSize={isMobile ? 2 : 4}
            fontWeight="500"
            sx={{ width: '40%' }}
          >
            {healthFactor && healthFactor !== Infinity ? healthFactor.toFixed(2) : '...'}
          </Flex>
        </Flex>
      </Grid>

      {isShowManage && (
        <Grid item md={2}>
          {actionType === PositionActions.Manage ? (
            <ManageButton
              onClick={() => {
                return history.push(`/dashboard/position?vaultAddress=${position.vaultAddress}`);
              }}
            >
              Manage
            </ManageButton>
          ) : actionType === PositionActions.Liquidate ? (
            <ManageButton>Liquidate</ManageButton>
          ) : (
            <span style={{ width: '5rem' }} />
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default PositionElement;
