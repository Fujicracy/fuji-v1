import React from "react";
import "./ProvidersList.css";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { useContractReader } from "./hooks";
import { DAI_ADDRESS } from "./constants";

function ProvidersList({ contracts }) {
  const activeProviderAddr = useContractReader(
    contracts,
    "VaultETHDAI",
    "activeProvider",
  );

  const aaveAddr = contracts && contracts["ProviderAave"]
    ? contracts["ProviderAave"].address
    : '';
  const aaveRate = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );

  //const compoundAddr = contracts && contracts["ProviderCompound"]
    //? contracts["ProviderCompound"].address
    //: '';
  const compoundRate = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );
  const aaveR = parseFloat(`${aaveRate}`) / 1e27 * 100;
  const compoundR = parseFloat(`${compoundRate}`) / 1e27 * 100;

  return (
    <div className="dark-block providers-block">
      <div className="section-title">
        <Typography variant="h3">
          Providers
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </span>
        </div>
      </div>

      <div className="providers">
        <div className="provider">
          <div className="title">
            <img src="https://assets.codepen.io/194136/dai.svg" />
            <Typography variant="h3">
              DAI
            </Typography>
          </div>
          <div className="stats">
            <div className="stat best">
              <span className="name">Aave</span>
              <span className="number">
                {aaveRate ? aaveR.toFixed(1) : "..."} %
              </span>
            </div>

            <div className="stat">
              <span className="name">Compound</span>
              <span className="number">
                {compoundRate ? compoundR.toFixed(1) : "..."} %
              </span>
            </div>
          </div>
        </div>

        <div className="provider">
          <div className="title">
            <img src="https://assets.codepen.io/194136/usdc.svg" />
            <Typography variant="h3">
              USDC
            </Typography>
          </div>
          <div className="stats">
            <div className="stat best">
              <span className="name">Aave</span>
              <span className="number">12,4%</span>
            </div>

            <div className="stat">
              <span className="name">Compound</span>
              <span className="number">9,4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProvidersList;
