import React, { useState, useEffect, useReducer } from 'react';
import { useSpring } from 'react-spring';
import { Trans } from 'react-i18next';

import { Flex } from 'rebass';
import { Typography, Button, Collapse } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useMediaQuery } from 'react-responsive';

import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { useExchangePrice } from '../../hooks';
import { PositionRatios } from '../../helpers';
import { SectionTitle, BlackBoxContainer } from '../Blocks';
import { Tooltip, IntenseSpan } from '../UI';

import {
  SvgContainer,
  InnerProgress,
  ChartBackground,
  Ratio,
  ChartContainer,
  ChartContent,
  AnimatedCircle,
  AnimatedLine,
  PositionDetails,
} from './styles';

function hsl(r) {
  const hue = (r / 100) * 120;
  return `hsl(${Math.min(hue, 120)}, 100%, 50%)`;
}

function hslToHex(r) {
  const h = Math.min((r / 100) * 120, 120);
  const l = 50 / 100;
  const a = (100 * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
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

function CollaterizationIndicator({ position }) {
  const { borrowAsset, collateralAsset, threshold } = position.vault;

  const collateralAssetPrice = useExchangePrice(collateralAsset);
  const borrowAssetPrice = useExchangePrice(borrowAsset);

  const [more, setMore] = useState(false);
  const [healthFactor, setHealthFactor] = useState(0);
  const [healthRatio, setHealthRatio] = useState(0);
  const [oldHealthRatio, setOldHealthRatio] = useReducer((oldV, newV) => {
    return newV;
  }, healthRatio);
  const [borrowLimit, setLimit] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [liqPrice, setLiqPrice] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  useEffect(() => {
    const ratios = PositionRatios(position, collateralAssetPrice, borrowAssetPrice);
    setHealthFactor(ratios.healthFactor);
    setLiqPrice(ratios.liqPrice);
    setLtv(ratios.ltv);
    setLimit(ratios.borrowLimit);

    const hr = logslider(ratios.healthFactor);
    setOldHealthRatio(healthRatio);
    setHealthRatio(hr);
  }, [collateralAssetPrice, borrowAssetPrice, position, healthRatio]);

  const props = useSpring({
    to: {
      strokeDasharray: [healthRatio, 100],
      filter: `drop-shadow(0px 0px .5px ${hslToHex(healthRatio)})`,
    },
    from: { strokeDasharray: [oldHealthRatio, 100] },
  });

  return (
    <BlackBoxContainer
      padding={isMobile ? '32px 28px 16px' : isTablet ? '44px 36px 40px' : '32px 28px 20px'}
    >
      <SectionTitle fontSize={isMobile ? '16px' : isTablet ? '20px' : '16px'}>
        <Trans i18nKey="healthFactor.title">Health Factor</Trans>
        {!isMobile && !isTablet && (
          <Tooltip>
            <InfoOutlinedIcon />
            <span>
              <Trans i18nKey="healthFactor.tooltip">
                The health factor represents the safety of your loan derived from the proportion of
                collateral versus amount borrowed.
                <IntenseSpan primary>Keep it above 1 to avoid liquidation.</IntenseSpan>
              </Trans>
            </span>
          </Tooltip>
        )}
      </SectionTitle>

      {isMobile || isTablet ? (
        <>
          <Flex justifyContent="center" alignItems="center" color="white">
            <SectionTitle
              fontSize={isMobile ? '24px' : isTablet ? '28px' : '16px'}
              m={isMobile ? '16px' : '24px'}
              color={isTablet && hsl(healthRatio)}
            >
              {healthFactor && healthFactor !== Infinity ? healthFactor.toFixed(2) : '...'}
            </SectionTitle>
          </Flex>
          <Flex width={1 / 1}>
            <InnerProgress>
              <SvgContainer viewBox="0 0 100 4" filterColor={hsl(healthRatio)}>
                <AnimatedLine
                  className="progress"
                  stroke={hsl(healthRatio)}
                  style={props}
                  d="M 3 2 l 100 0"
                />
              </SvgContainer>
            </InnerProgress>
          </Flex>
        </>
      ) : (
        <>
          <Ratio>
            <ChartContainer>
              <SvgContainer viewBox="0 0 36 36" filterColor={hsl(healthRatio)}>
                <AnimatedCircle
                  // className="circle"
                  stroke={hsl(healthRatio)}
                  style={props}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </SvgContainer>
            </ChartContainer>
            <ChartContent>
              {healthFactor && healthFactor !== Infinity ? healthFactor.toFixed(2) : '...'}
            </ChartContent>
            <ChartBackground />
          </Ratio>

          <PositionDetails>
            <div className="title">
              <Typography variant="h3">
                <Trans i18nKey="healthFactor.borrowLimitUsed">Borrow Limit Used</Trans>
              </Typography>
            </div>
            <div className="number">{borrowLimit ? (borrowLimit * 100).toFixed(1) : '...'} %</div>
          </PositionDetails>
        </>
      )}
      <Collapse in={more}>
        <PositionDetails>
          <Flex justifyContent="flex-start" alignItems="center" width="80%">
            <span>
              <Trans i18nKey="healthFactor.currentLoanToValue.title">Current Loan-to-Value</Trans>
            </span>
            {!isMobile && !isTablet && (
              <Tooltip>
                <InfoOutlinedIcon />
                <span>
                  <Trans i18nKey="healthFactor.currentLoanToValue.tooltip">
                    The Maximum Loan-to-Value ratio represents the maximum borrow limit. A max. LTV
                    of {{ threshold }}% means the user can borrow up to ${{ threshold }} in the
                    principal currency for every $100 worth of collateral.
                    <IntenseSpan primary>With LTV above 75% they risk a liquidation.</IntenseSpan>
                  </Trans>
                </span>
                {/* <span>
                  <Trans i18nKey="healthFactor.tooltip">
                    The health factor represents the safety of your loan derived from the proportion
                    of collateral versus amount borrowed.
                    <IntenseSpan primary>Keep it above 1 to avoid liquidation.</IntenseSpan>
                  </Trans>
                </span> */}
              </Tooltip>
            )}
          </Flex>
          <div className="number">{ltv && ltv !== Infinity ? (ltv * 100).toFixed(1) : '...'} %</div>
        </PositionDetails>
        <PositionDetails>
          <div className="title">
            <Trans i18nKey="healthFactor.ltvLiquidationThreshold">LTV liquidation threshold</Trans>
          </div>
          <div className="number">{threshold} %</div>
        </PositionDetails>
        <PositionDetails>
          <div className="title">
            <Trans i18nKey="healthFactor.currentCollateralPrice">
              Current {{ collateral: collateralAsset.name }} price
            </Trans>
          </div>
          <div className="number">
            $ {collateralAssetPrice ? collateralAssetPrice.toFixed(2) : '...'}
          </div>
        </PositionDetails>
        <PositionDetails>
          <div className="title">
            <Trans i18nKey="healthFactor.collateralLiquidationPrice">
              {{ collateral: collateralAsset.name }} liquidation price
            </Trans>
          </div>
          <div className="number">
            $ {liqPrice && liqPrice !== Infinity ? liqPrice.toFixed(2) : '...'}
          </div>
        </PositionDetails>
      </Collapse>
      {isMobile || isTablet ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          color="white"
          m={isMobile ? '16px 16px 0px' : '24px 24px 0px'}
        >
          {more ? (
            <ExpandLessIcon
              style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.5)' }}
              onClick={() => setMore(!more)}
            />
          ) : (
            <ExpandMoreIcon
              style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.5)' }}
              onClick={() => setMore(!more)}
            />
          )}
        </Flex>
      ) : (
        <PositionDetails>
          <Button
            size="small"
            disableRipple
            onClick={() => {
              return setMore(!more);
            }}
            endIcon={more ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <Trans i18nKey={more ? 'healthFactor.showLess' : 'healthFactor.showMore'}>
              {more ? 'Show less' : 'Show more'}
            </Trans>
          </Button>
        </PositionDetails>
      )}
    </BlackBoxContainer>
  );
}

export default CollaterizationIndicator;
