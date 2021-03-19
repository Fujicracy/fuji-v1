import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Dashboard.css";
import { useContractReader } from "./hooks";
import { DAI_ADDRESS } from "./constants";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import PositionElement, { PositionActions } from "./PositionElement";
import DebtForm from "./DebtForm";
import CollateralForm from "./CollateralForm";
import ProvidersList from "./ProvidersList";
import CollaterizationIndicator from "./CollaterizationIndicator";

function Dashboard({ contracts, provider, address, setRoute }) {
  const location = useLocation();

  const [actionsType, setActionsType] = useState('single');

  useEffect(() => {
    setRoute(location.pathname);
  }, [location, setRoute]);

  //const debtBalance = useContractReader(
    //contracts,
    //"DebtToken",
    //"balanceOf",
    //[address]
  //);
  //const collateralBalance = useContractReader(
    //contracts,
    //"VaultETHDAI",
    //"collaterals",
    //[address]
  //);
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

  return (
    <div class="container">
      <div class="left-content">
        <div class="positions manage-position">
          <div class="section-title">
            <a href="/my-positions" class="back-to-link">
              <span class="back-icon">
                <ArrowBackIosOutlinedIcon />
              </span>
              <h3>Back to all my positions</h3>
            </a>
          </div>

          <div class="position-board">
            <div class="legend">
              <span class="empty-tab"></span>
              <div class="legend-elements">
                <span>Collateral</span>
                <span>Debt</span>
                <span>Debt Ratio</span>
              </div>
              <span class="empty-button"></span>
            </div>

            <div class="manage-my-position one-position">
              <PositionElement
                actionType={PositionActions.None}
                contracts={contracts}
                address={address}
              />

              <div class="manage-settings">
                <div class="manage-mode">
                  <div class="toggle-mode">
                    <div class="button">
                      <input
                        onChange={({ target }) => setActionsType(target.checked ? 'single' : 'combo' )}
                        type="checkbox"
                        class="checkbox"
                      />
                      <div class="knobs">
                        <span class="toggle-options" data-toggle="Combo">
                          <span>Single</span>
                        </span>
                      </div>
                      <div class="layer"></div>
                    </div>
                  </div>
                </div>

                <form noValidate>
                  <div class="manage-content">
                    <div class="col-50">
                      <DebtForm
                        contracts={contracts}
                        provider={provider}
                        address={address}
                      />
                    </div>
                    <div class="col-50">
                      <CollateralForm
                        contracts={contracts}
                        provider={provider}
                        address={address}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FlashClose />
      </div>
      <div class="right-content">
        <CollaterizationIndicator
        />
        <ProvidersList
          contracts={contracts}
        />
      </div>
    </div>
  );
}

function FlashClose() {
  return (
    <div class="flash-close">
      <div class="section-title">
        <h3>Flash Close</h3>
        <div class="tooltip-info">
          <InfoOutlinedIcon />
          <span class="tooltip">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </span>
        </div>
      </div>

      <div class="content">
        <div class="description">
          Use a flashloan to close your position, or just part of it.
          <br />
          <span class="bold">Fee: 1%</span>
        </div>

        <div class="actions">
          <button>Partial</button>
          <button>Total</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
