import React from "react";
import "./ProvidersList.css";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';
import { useContractReader } from "./hooks";
import { DAI_ADDRESS, USDC_ADDRESS } from "./constants";

function ProvidersList({ contracts, markets }) {
  //const activeProviderAddr = useContractReader(
    //contracts,
    //"VaultETHDAI",
    //"activeProvider",
  //);

  //const aaveAddr = contracts && contracts["ProviderAave"]
    //? contracts["ProviderAave"].address
    //: '';
  const aaveDai = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );
  const aaveUsdc = useContractReader(
    contracts,
    "ProviderAave",
    "getBorrowRateFor",
    [USDC_ADDRESS]
  );

  //const compoundAddr = contracts && contracts["ProviderCompound"]
    //? contracts["ProviderCompound"].address
    //: '';
  const compoundDai = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [DAI_ADDRESS]
  );
  const compoundUsdc = useContractReader(
    contracts,
    "ProviderCompound",
    "getBorrowRateFor",
    [USDC_ADDRESS]
  );
  const aaveDaiRate = parseFloat(`${aaveDai}`) / 1e27 * 100;
  const compoundDaiRate = parseFloat(`${compoundDai}`) / 1e27 * 100;
  const aaveUsdcRate = parseFloat(`${aaveUsdc}`) / 1e27 * 100;
  const compoundUsdcRate = parseFloat(`${compoundUsdc}`) / 1e27 * 100;

  return (
    <div className="dark-block providers-block">
      <div className="section-title">
        <Typography variant="h3">
          Markets
        </Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </span>
        </div>
      </div>

      <div className="providers">
        {markets && markets.includes("DAI")
          ? <div className="provider">
              <div className="title">
                <img alt="dai" src="/DAI.png" />
                <Typography variant="h3">
                  DAI
                </Typography>
              </div>
              <div className="stats">
                <div className="stat best">
                  <span className="name">Aave</span>
                  <span className="number">
                    {aaveDai ? aaveDaiRate.toFixed(1) : "..."} %
                  </span>
                </div>

                <div className="stat">
                  <span className="name">Compound</span>
                  <span className="number">
                    {compoundDai ? compoundDaiRate.toFixed(1) : "..."} %
                  </span>
                </div>
              </div>
            </div>
          : ""}

        {markets && markets.includes("USDC")
          ? <div className="provider">
             <div className="title">
               <img alt="usdc" src="/USDC.png" />
               <Typography variant="h3">
                 USDC
               </Typography>
             </div>
             <div className="stats">
               <div className="stat best">
                 <span className="name">Aave</span>
                 <span className="number">
                   {aaveUsdc ? aaveUsdcRate.toFixed(1) : "..."} %
                 </span>
               </div>

               <div className="stat">
                 <span className="name">Compound</span>
                 <span className="number">
                   {compoundUsdc ? compoundUsdcRate.toFixed(1) : "..."} %
                 </span>
               </div>
             </div>
           </div>
         : ""}
      </div>
    </div>
  );
}

export default ProvidersList;
