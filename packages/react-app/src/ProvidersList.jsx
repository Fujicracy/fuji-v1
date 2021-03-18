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
    <div class="dark-block providers-block">
      <div class="section-title">
        <Typography variant="h3">
          Providers
        </Typography>
        <div class="tooltip-info">
          <InfoOutlinedIcon />
          <span class="tooltip">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </span>
        </div>
      </div>

      <div class="providers">
        <div class="provider">
          <div class="title">
            <img src="https://assets.codepen.io/194136/dai.svg" />
            <Typography variant="h3">
              DAI
            </Typography>
          </div>
          <div class="stats">
            <div class="stat best">
              <span class="name">Aave</span>
              <span class="number">
                {aaveRate ? aaveR.toFixed(1) : "..."} %
              </span>
            </div>

            <div class="stat">
              <span class="name">Compound</span>
              <span class="number">
                {compoundRate ? compoundR.toFixed(1) : "..."} %
              </span>
            </div>
          </div>
        </div>

        <div class="provider">
          <div class="title">
            <img src="https://assets.codepen.io/194136/usdc.svg" />
            <Typography variant="h3">
              USDC
            </Typography>
          </div>
          <div class="stats">
            <div class="stat best">
              <span class="name">Aave</span>
              <span class="number">12,4%</span>
            </div>

            <div class="stat">
              <span class="name">Compound</span>
              <span class="number">9,4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProvidersList;
