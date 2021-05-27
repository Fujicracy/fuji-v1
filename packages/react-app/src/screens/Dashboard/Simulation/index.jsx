import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ResponsiveBar } from '@nivo/bar';

import { useRates } from '../../../hooks';
import ProvidersList from '../../../components/ProvidersList';
import HowItWorks from '../../../components/HowItWorks';
import ProtocolStats from '../../../components/ProtocolStats';

import './styles.css';

function Simulation({ contracts /* , address */ }) {
  const history = useHistory();
  const rates = useRates(contracts);

  const [borrowAmount, setBorrowAmount] = useState(1000);
  const [borrowAsset, setBorrowAsset] = useState('DAI');

  const onBorrow = () =>
    history.push(`/dashboard/init-borrow?borrowAsset=${borrowAsset}&borrowAmount=${borrowAmount}`);

  const calcInterest = (amount, period, protocol) => {
    const apr = rates[protocol][borrowAsset.toLowerCase()];
    const i =
      Number(amount) * Math.exp((period / 365) * (Number(apr || 10) / 100)) - Number(amount);
    return i.toFixed(0);
  };

  const onChangeAmount = v => {
    if (Number(v) < 1) return [];

    return [
      // {
      // period: "1 month",
      // Aave: calcInterest(v, 30, "aave"),
      // Compound: calcInterest(v, 30, "compound"),
      // Fuji: calcInterest(v, 30, "fuji"),
      // },
      {
        period: '3 months',
        Aave: calcInterest(v, 90, 'aave'),
        Compound: calcInterest(v, 90, 'compound'),
        dYdX: calcInterest(v, 90, 'dydx'),
        Fuji: calcInterest(v, 90, 'fuji'),
      },
      {
        period: '6 months',
        Aave: calcInterest(v, 180, 'aave'),
        Compound: calcInterest(v, 180, 'compound'),
        dYdX: calcInterest(v, 180, 'dydx'),
        Fuji: calcInterest(v, 180, 'fuji'),
      },
      {
        period: '1 year',
        Aave: calcInterest(v, 365, 'aave'),
        Compound: calcInterest(v, 365, 'compound'),
        dYdX: calcInterest(v, 365, 'dydx'),
        Fuji: calcInterest(v, 365, 'fuji'),
      },
    ];
  };

  const chartData = onChangeAmount(borrowAmount);

  // <label>
  // <input type="radio" name="borrow" value="usdt" disabled={true} />
  // <div className="fake-radio">
  // <img alt="usdt" src="/USDT.svg" />
  // <span className="select-option-name">USDT</span>
  // </div>
  // </label>
  return (
    <div className="container">
      <div className="left-content">
        <HowItWorks />
        <div className="fuji-charts dark-block">
          <div className="section-title">
            <Typography variant="h3">Loan expenses based on current borrow APRs</Typography>
          </div>

          <div className="chart-container">
            <SimulationChart
              data={chartData}
              borrowAsset={borrowAsset}
              borrowAmount={borrowAmount}
            />
          </div>

          <form noValidate>
            <div className="borrow-options">
              <div className="section-title">Borrow</div>
              <div className="select-options">
                <div className="options-list">
                  <label>
                    <input
                      type="radio"
                      name="borrow"
                      value="DAI"
                      onChange={(/* { target } */) => setBorrowAsset('DAI')}
                      checked={borrowAsset === 'DAI'}
                    />
                    <div className="fake-radio">
                      <img alt="dai" src="/DAI.svg" />
                      <span className="select-option-name">DAI</span>
                    </div>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="borrow"
                      value="USDC"
                      onChange={(/* { target } */) => setBorrowAsset('USDC')}
                      checked={borrowAsset === 'USDC'}
                    />
                    <div className="fake-radio">
                      <img alt="usdc" src="/USDC.svg" />
                      <span className="select-option-name">USDC</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="charts-buttons">
              <div className="fake-input">
                <TextField
                  className="input-container"
                  fullWidth
                  placeholder="1000"
                  autoComplete="off"
                  id="borrowAmount"
                  name="borrowAmount"
                  type="number"
                  variant="outlined"
                  onChange={({ target }) => setBorrowAmount(target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar alt={borrowAsset} src={`/${borrowAsset}.png`} className="icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body1" className="input-infos">
                          {borrowAsset}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button onClick={() => onBorrow()} className="main-button">
                Go Borrow
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="right-content">
        <ProtocolStats />
        <ProvidersList contracts={contracts} markets={[borrowAsset]} />
      </div>
    </div>
  );
}

function SimulationChart({ data, borrowAsset, borrowAmount }) {
  return (
    <ResponsiveBar
      valueScale={{ type: 'linear' }}
      layout="vertical"
      groupMode="grouped"
      data={data}
      keys={['Aave', 'Compound', 'dYdX', 'Fuji']}
      indexBy="period"
      margin={{
        top: 30,
        right: 40,
        bottom: 40,
        left: 50,
      }}
      innerPadding={15}
      padding={0.2}
      enableGridX
      axisLeft={{
        legend: borrowAsset,
        legendPosition: 'middle',
        legendOffset: -45,
      }}
      animate
      motionStiffness={90}
      motionDamping={15}
      tooltip={({ id, value, indexValue }) => (
        <p>
          You&apos;ll pay ~{value} {borrowAsset} as interest for {indexValue}
          <br />
          by borrowing {borrowAmount} {borrowAsset} from {id}
        </p>
      )}
      defs={[
        {
          id: 'gradientFuji',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#F0014F', opacity: 1 },
            { offset: 100, color: '#F0014F', opacity: 0.7 },
          ],
        },
        {
          id: 'gradientCompound',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#0B9ED9', opacity: 1 },
            { offset: 100, color: '#0B9ED9', opacity: 0.7 },
          ],
        },
        {
          id: 'gradientAave',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#FFFFFF' },
            { offset: 100, color: '#757575' },
          ],
        },
        {
          id: 'gradientdYdX',
          type: 'linearGradient',
          colors: [
            { offset: 0, color: '#008A27' },
            { offset: 100, color: '#004411' },
          ],
        },
      ]}
      fill={[
        { match: { id: 'Aave' }, id: 'gradientAave' },
        { match: { id: 'Compound' }, id: 'gradientCompound' },
        { match: { id: 'dYdX' }, id: 'gradientdYdX' },
        { match: { id: 'Fuji' }, id: 'gradientFuji' },
      ]}
      theme={{
        tooltip: {
          fontSize: 11,
          container: {
            background: '#a0a0a0',
          },
        },
        fontSize: 12,
        textColor: 'rgba(255,255,255,0.64)',
        axis: {
          domain: {
            line: {
              strokeWidth: 0,
            },
          },
          ticks: {
            line: {
              strokeWidth: 0,
            },
          },
        },
        grid: {
          line: {
            stroke: '#000000',
            strokeWidth: 1,
          },
        },
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'top-left',
          direction: 'column',
          justify: false,
          translateX: 10,
          translateY: 10,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 30,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}

export default Simulation;
