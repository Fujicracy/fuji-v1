import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import "./Simulation.css";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ResponsiveBar } from '@nivo/bar'

import ProtocolStats from "../ProtocolStats";
import HowItWorks from "../HowItWorks";

const data = [
  {
    "period": "1 month",
    "Aave": 60,
    "Compound": 40,
    "Fuji": 20,
  },
  {
    "period": "3 months",
    "Aave": 180,
    "Compound": 120,
    "Fuji": 60,
  },
  {
    "period": "6 months",
    "Aave": 360,
    "Compound": 240,
    "Fuji": 120,
  },
  {
    "period": "1 year",
    "Aave": 720,
    "Compound": 480,
    "Fuji": 240,
  },
];

const calcInterest = (amount, period, protocol) => {
  const apr = {
    aave: 0.1,
    compound: 0.07,
    fuji: 0.05
  };
  return Number(amount) * Math.exp((period / 365) * apr[protocol]) - Number(amount);
}

function Simulation({ contracts, address }) {
  const history = useHistory();

  const [borrowAmount, setBorrowAmount] = useState(1000);
  const [borrowAsset, setBorrowAsset] = useState('DAI');
  const [chartData, setChartData] = useState(data);

  const onBorrow = () => history.push(
    `/dashboard/init-borrow?borrowAsset=${borrowAsset}&borrowAmount=${borrowAmount}`
  );

  const onChangeAmount = (v) => {
    if (Number(v) < 1)
      return;
    const newData = chartData.map(el => {
      if (el.period === "1 month") {
        return {
          period: "1 month",
          Aave: calcInterest(v, 30, "aave"),
          Compound: calcInterest(v, 30, "compound"),
          Fuji: calcInterest(v, 30, "fuji"),
        }
      }
      else if (el.period === "3 months") {
        return {
          period: "3 months",
          Aave: calcInterest(v, 90, "aave"),
          Compound: calcInterest(v, 90, "compound"),
          Fuji: calcInterest(v, 90, "fuji"),
        }
      }
      else if (el.period === "6 months") {
        return {
          period: "6 months",
          Aave: calcInterest(v, 180, "aave"),
          Compound: calcInterest(v, 180, "compound"),
          Fuji: calcInterest(v, 180, "fuji"),
        }
      }
      else if (el.period === "1 year") {
        return {
          period: "1 year",
          Aave: calcInterest(v, 365, "aave"),
          Compound: calcInterest(v, 365, "compound"),
          Fuji: calcInterest(v, 365, "fuji"),
        }
      }
    });
    console.log(newData);
    setChartData(newData);
    setBorrowAmount(v);
  }

  return (
    <div className="container initial-step">
      <div className="center-content">
        <ProtocolStats />
        <div className="fuji-charts dark-block">
          <div className="section-title">
            <Typography variant="h3">
              Simulation
            </Typography>
          </div>

          <div className="chart-container">
            <SimulationChart data={chartData} />
          </div>

            <form noValidate>
              <div className="borrow-options">
                <div className="subtitle">Borrow</div>
                <div className="select-options">
                  <div className="options-list">
                    <label>
                      <input
                        type="radio"
                        name="borrow"
                        value="DAI"
                        onChange={({ target }) => setBorrowAsset('DAI')}
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
                        onChange={({ target }) => setBorrowAsset('USDC')}
                        checked={borrowAsset === 'USDC'}
                      />
                      <div className="fake-radio">
                        <img alt="usdc" src="/USDC.svg" />
                        <span className="select-option-name">USDC</span>
                      </div>
                    </label>
                    <label>
                      <input type="radio" name="borrow" value="usdt" disabled={true} />
                      <div className="fake-radio">
                        <img alt="usdt" src="/USDT.svg" />
                        <span className="select-option-name">USDT</span>
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
                    type="tel"
                    variant="outlined"
                    onChange={({ target }) => onChangeAmount(target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Avatar alt={borrowAsset} src={`/${borrowAsset}.png`} className="icon"/>
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
                <Button
                  onClick={() => onBorrow()}
                  className="main-button"
                >
                  Borrow
                </Button>
              </div>
            </form>
        </div>
        <HowItWorks />
      </div>
    </div>
  );
}

function SimulationChart({ data }) {
  return (
    <ResponsiveBar
      valueScale={{ type: "linear" }}
      layout="vertical"
      groupMode="grouped"
      data={data}
      keys={[ 'Aave', 'Compound', 'Fuji' ]}
      indexBy="period"
      margin={{
        top: 30,
        right: 40,
        bottom: 40,
        left: 50
      }}
      innerPadding={15}
      padding={0.4}
      enableLabel={false}
      enableGridX={true}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
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
      ]}
      fill={[
        { match: { id: 'Aave' }, id: 'gradientAave' },
        { match: { id: 'Compound' }, id: 'gradientCompound' },
        { match: { id: 'Fuji' }, id: 'gradientFuji' },
      ]}
      theme={{
        "fontSize": 12,
        "axis": {
          "domain": {
            "line": {
              "strokeWidth": 0
            }
          },
          "ticks": {
            "line": {
              "strokeWidth": 0
            }
          }
        },
        "grid": {
          "line": {
            "stroke": "#000000",
            "strokeWidth": 1
          }
        }
      }}
      legends={[
        {
          dataFrom: "keys",
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: 10,
            translateY: 10,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 30,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1
            }
          }
            ]
        }
      ]}
    />
  );
}

export default Simulation;
