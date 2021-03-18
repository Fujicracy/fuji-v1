import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Simulation.css";
//import { formatUnits, formatEther } from "@ethersproject/units";
//import "./Simulation.css";
//import { useContractReader } from "./hooks";
//import Grid from '@material-ui/core/Grid';
//import Button from '@material-ui/core/Button';
import { ResponsiveBar } from '@nivo/bar'

function Simulation({ contracts, address, setRoute }) {
  const location = useLocation();

  useEffect(() => {
    setRoute(location.pathname);
  },[location])

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
    <div class="chart-container">
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
          "background": "rgba(255, 255, 255, 0.05)",
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
              "stroke": "#dddddd",
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
    </div>
  );
}

export default Simulation;
