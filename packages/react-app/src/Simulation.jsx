import React, { useEffect, useState } from "react";
import "./Simulation.css";
//import { formatUnits, formatEther } from "@ethersproject/units";
//import { useContractReader } from "./hooks";
//import Grid from '@material-ui/core/Grid';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ResponsiveBar } from '@nivo/bar'

import ProtocolStats from "./ProtocolStats";
import HowItWorks from "./HowItWorks";

function Simulation({ contracts, address }) {

  const [borrowAmount, setBorrowAmount] = useState(1000);

  const data = [
    {
      "period": "1 month",
      "Aave": 60,
      "AaveColor": "hsl(97, 70%, 50%)",
      "Compound": 40,
      "CompoundColor": "linear-gradient(180deg, #1E1B1C 0%, #101010 100%), rgba(255, 255, 255, 0.3)",
      "Fuji": 20,
      "FujiColor": "hsl(148, 70%, 50%)",
    },
    {
      "period": "3 months",
      "Aave": 180,
      "AaveColor": "hsl(97, 70%, 50%)",
      "Compound": 120,
      "CompoundColor": "linear-gradient(180deg, #1E1B1C 0%, #101010 100%), rgba(255, 255, 255, 0.3)",
      "Fuji": 60,
      "FujiColor": "hsl(148, 70%, 50%)",
    },
    {
      "period": "6 month",
      "Aave": 360,
      "AaveColor": "hsl(97, 70%, 50%)",
      "Compound": 240,
      "CompoundColor": "linear-gradient(180deg, #1E1B1C 0%, #101010 100%), rgba(255, 255, 255, 0.3)",
      "Fuji": 120,
      "FujiColor": "hsl(148, 70%, 50%)",
    },
    {
      "period": "1 year",
      "Aave": 720,
      "AaveColor": "hsl(97, 70%, 50%)",
      "Compound": 480,
      "CompoundColor": "linear-gradient(180deg, #1E1B1C 0%, #101010 100%), rgba(255, 255, 255, 0.3)",
      "Fuji": 240,
      "FujiColor": "hsl(148, 70%, 50%)",
    },
  ]

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
            <SimulationChart data={data} />
          </div>

            <form noValidate>
              <div className="borrow-options">
                <div className="subtitle">Borrow</div>
                <div className="select-options">
                  <div className="options-list">
                    <label>
                      <input type="radio" name="borrow" value="dai" checked />
                      <div className="fake-radio">
                        <img alt="dai" src="https://assets.codepen.io/194136/dai.svg" />
                        <span className="select-option-name">DAI</span>
                      </div>
                    </label>
                    <label>
                      <input type="radio" name="borrow" value="usdc" />
                      <div className="fake-radio">
                        <img alt="usdc" src="https://assets.codepen.io/194136/usdc.svg" />
                        <span className="select-option-name">USDC</span>
                      </div>
                    </label>
                    <label>
                      <input type="radio" name="borrow" value="usdt" />
                      <div className="fake-radio">
                        <img alt="usdt" src="https://assets.codepen.io/194136/tether.svg" />
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
                    onChange={({ target }) => setBorrowAmount(target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Avatar alt="DAI" src="/DAI.png" className="icon"/>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body1" className="input-infos">
                            DAI
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <Button className="main-button" > Borrow </Button>
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
