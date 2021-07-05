import React, { useState, useEffect, useReducer } from 'react';
import { useSpring, animated } from 'react-spring';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { useExchangePrice } from '../../hooks';
import { PositionRatios } from '../../helpers';
import { SectionTitle, BlackBoxContainer } from '../Blocks';

import './styles.css';

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
  const price = useExchangePrice();

  const [more, setMore] = useState(false);
  const [healthFactor, setHealthFactor] = useState(0);
  const [healthRatio, setHealthRatio] = useState(0);
  const [oldHealthRatio, setOldHealthRatio] = useReducer((oldV, newV) => {
    return newV;
  }, healthRatio);
  const [borrowLimit, setLimit] = useState(0);
  const [ltv, setLtv] = useState(0);
  const [liqPrice, setLiqPrice] = useState(0);

  useEffect(() => {
    const ratios = PositionRatios(position, price);

    setHealthFactor(ratios.healthFactor);
    setLiqPrice(ratios.liqPrice);
    setLtv(ratios.ltv);
    setLimit(ratios.borrowLimit);

    const hr = logslider(ratios.healthFactor);
    setOldHealthRatio(healthRatio);
    setHealthRatio(hr);
  }, [price, position, healthRatio]);

  const props = useSpring({
    to: {
      strokeDasharray: [healthRatio, 100],
      filter: `drop-shadow(0px 0px .5px ${hslToHex(healthRatio)})`,
    },
    from: { strokeDasharray: [oldHealthRatio, 100] },
  });

  return (
    <BlackBoxContainer mt={4}>
      <SectionTitle mb={4}>
        <Typography variant="h3">Health Factor</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            The health factor represents the safety of your loan derived from the proportion of
            collateral versus amount borrowed.
            <br />
            <span className="bold">Keep it above 1 to avoid liquidation.</span>
          </span>
        </div>
      </SectionTitle>

      <div className="ratio">
        <div className="svg-chart">
          <svg viewBox="0 0 36 36" className="inner-chart">
            <animated.path
              className="circle"
              stroke={hsl(healthRatio)}
              style={props}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
        <div className="percentage-chart">
          {healthFactor && healthFactor !== Infinity ? healthFactor.toFixed(2) : '..'}
        </div>
        <div className="bg-chart" />
      </div>

      <div className="position-details first">
        <div className="title">
          <Typography variant="h3">Borrow Limit Used</Typography>
        </div>
        <div className="number">{borrowLimit ? (borrowLimit * 100).toFixed(1) : '...'} %</div>
      </div>
      <Collapse in={more}>
        <div className="position-details">
          <div className="title">
            Current Loan-to-Value
            <div className="tooltip-info">
              <InfoOutlinedIcon />
              <span className="tooltip">
                The Maximum Loan-to-Value ratio represents the maximum borrow limit.
                <br />
                A max. LTV of 75% means the user can borrow up to $75 in the principal currency for
                every $100 worth of collateral.
                <br />
                <span className="bold">With LTV above 75% they risk a liquidation.</span>
              </span>
            </div>
          </div>
          <div className="number">{ltv && ltv !== Infinity ? (ltv * 100).toFixed(1) : '...'} %</div>
        </div>
        <div className="position-details">
          <div className="title">LTV liquidation threshold</div>
          <div className="number">75 %</div>
        </div>
        <div className="position-details">
          <div className="title">Current ETH price</div>
          <div className="number">$ {price ? price.toFixed(2) : '...'}</div>
        </div>
        <div className="position-details">
          <div className="title">ETH liquidation price</div>
          <div className="number">
            $ {liqPrice && liqPrice !== Infinity ? liqPrice.toFixed(2) : '...'}
          </div>
        </div>
      </Collapse>
      <div className="position-details">
        <Button
          size="small"
          disableRipple
          onClick={() => {
            return setMore(!more);
          }}
          endIcon={more ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Show {more ? 'less' : 'more'}
        </Button>
      </div>
    </BlackBoxContainer>
  );
}

export default CollaterizationIndicator;
