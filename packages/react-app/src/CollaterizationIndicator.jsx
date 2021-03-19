import React from "react";
import { useExchangePrice } from "./hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import "./CollaterizationIndicator.css";
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const mainnetProvider = new JsonRpcProvider(
  "https://eth-mainnet.alchemyapi.io/v2/kXCJNELs1PVaRNffous3Uytnw4A7BJUr"
);

function CollaterizationIndicator({ daiAmount, ethAmount }) {
  const classes = {};
  const price = useExchangePrice(mainnetProvider);

  const ratio = ethAmount && daiAmount && price
    ? daiAmount / (ethAmount * price)
    : 0;

  return (
    <div class="dark-block collateralization-block">
      <div class="section-title">
        <Typography variant="h3">
          Collaterization Ratio
        </Typography>
        <div class="tooltip-info">
          <InfoOutlinedIcon />
          <span class="tooltip">
            <span class="bold">Keep your position safe.</span>
            <br />The ratio between your collateral assets and the borrowed amout.
          </span>
        </div>
      </div>

      <div class="ratio">
        <div class="svg-chart">
          <svg viewBox="0 0 36 36" class="inner-chart">
            <path class="circle" stroke-dasharray={[ratio * 100, 100]} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
        </div>
        <div class="percentage-chart">{ratio ? Math.floor(ratio * 100) : '...'}%</div>
        <div class="bg-chart"></div>
      </div>

      <Typography variant="body2">
        This ratio represents the safety of your loan derived from the proportion of collateral versus amount borrowed. Keep it above 1 to avoid liquidation.
      </Typography>
    </div>
  );
}

export default CollaterizationIndicator;
