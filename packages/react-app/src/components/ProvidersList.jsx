import React from "react";
import "./ProvidersList.css";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { useContractReader, useRates } from "../hooks";

function ProvidersList({ contracts, markets }) {
  const activeProviderDai = useContractReader(
    contracts,
    "VaultETHDAI",
    "activeProvider",
  );
  const activeProviderUsdc = useContractReader(
    contracts,
    "VaultETHUSDC",
    "activeProvider",
  );

  const providerAave = contracts && contracts["ProviderAave"];
  const providerCompound = contracts && contracts["ProviderCompound"];

  const rates = useRates(contracts);

  return (
    <div className="dark-block providers-block">
      <div className="section-title">
        <Typography variant="h3">
          Borrow APR
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Live fetching borrow rates from underlying protocols that provide liquidity.
          </span>
        </div>
      </div>

      <div className="providers">
        {markets && markets.includes("DAI") && (
          <div className="provider">
            <div className="title">
              <img alt="dai" src="/DAI.png" />
              <Typography variant="h3">
                DAI
              </Typography>
            </div>
            <div className="stats">
              <div className={providerAave?.address === activeProviderDai ? 'stat best' : 'stat'}>
                <span className="name">Aave</span>
                <span className="number">
                  {rates.aave.dai} %
                </span>
              </div>

              <div className={providerCompound?.address === activeProviderDai ? 'stat best' : 'stat'}>
                <span className="name">Compound</span>
                <span className="number">
                  {rates.compound.dai} %
                </span>
              </div>
            </div>
          </div>
        )}

        {markets && markets.includes("USDC") && (
          <div className="provider">
            <div className="title">
              <img alt="usdc" src="/USDC.png" />
              <Typography variant="h3">
                USDC
              </Typography>
            </div>
            <div className="stats">
              <div className={providerAave?.address === activeProviderUsdc ? 'stat best' : 'stat'}>
                <span className="name">Aave</span>
                <span className="number">
                  {rates.aave.usdc} %
                </span>
              </div>

              <div className={providerCompound?.address === activeProviderUsdc ? 'stat best' : 'stat'}>
                <span className="name">Compound</span>
                <span className="number">
                  {rates.compound.usdc} %
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProvidersList;
