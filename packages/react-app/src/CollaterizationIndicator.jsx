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
  const price = useExchangePrice(mainnetProvider);

  const ratio = ethAmount && daiAmount && price
    ? daiAmount / (ethAmount * price)
    : 0;

  return (
    <div className="dark-block collateralization-block">
      <div className="section-title">
        <Typography variant="h3">
          Borrow Limit Used
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            <span className="bold">Keep your position safe.</span>
            <br />The ratio between your collateral assets and the borrowed amout.
          </span>
        </div>
      </div>

      <div className="ratio">
        <div className="svg-chart">
          <svg viewBox="0 0 36 36" className="inner-chart">
            <path className="circle" strokeDasharray={[ratio * 100, 100]} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
        </div>
        <div className="percentage-chart">{ratio ? Math.floor(ratio * 100) : '...'}%</div>
        <div className="bg-chart"></div>
      </div>

      <Typography variant="body2">
        This percentage is derived from the proportion of collateral versus amount borrowed plus a safety buffer. It's recommended to keep it below 90% to avoid liquidation.
      </Typography>
    </div>
  );
}

export default CollaterizationIndicator;
