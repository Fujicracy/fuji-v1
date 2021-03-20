import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ManagePosition.css";
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import PositionElement, { PositionActions } from "../PositionElement";
import DebtForm from "./DebtForm";
import CollateralForm from "./CollateralForm";
import SupplyAndBorrowForm from "./SupplyAndBorrowForm";
import RepayAndWithdrawForm from "./RepayAndWithdrawForm";
import ProvidersList from "../ProvidersList";
import CollaterizationIndicator from "../CollaterizationIndicator";

function ManagePosition({ contracts, provider, address, }) {

  const [actionsType, setActionsType] = useState('single');

  return (
    <div className="container">
      <div className="left-content">
        <div className="positions manage-position">
          <div className="section-title">
            <Link to="my-positions" className="back-to-link">
              <span className="back-icon">
                <ArrowBackIosOutlinedIcon />
              </span>
              <h3>Back to my positions</h3>
            </Link>
          </div>

          <div className="position-board">
            <div className="legend">
              <span className="empty-tab"></span>
              <div className="legend-elements">
                <span>Collateral</span>
                <span>Debt</span>
                <span>Debt Ratio</span>
              </div>
              <span className="empty-button"></span>
            </div>

            <div className="manage-my-position one-position">
              <PositionElement
                actionType={PositionActions.None}
                contracts={contracts}
                address={address}
              />

              <div className="manage-settings">
                <div className="manage-mode">
                  <div className="toggle-mode">
                    <div className="button">
                      <input
                        onChange={({ target }) => setActionsType(target.checked ? 'combo' : 'single')}
                        type="checkbox"
                        className="checkbox"
                      />
                      <div className="knobs">
                        <span className="toggle-options" data-toggle="Combo">
                          <span>Single</span>
                        </span>
                      </div>
                      <div className="layer"></div>
                    </div>
                  </div>
                </div>

                <form noValidate>
                  <div className="manage-content">
                    <div className="col-50">{
                      actionsType === 'single'
                        ? <CollateralForm
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                        : <SupplyAndBorrowForm 
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      }
                    </div>
                    <div className="col-50">{
                      actionsType === 'single'
                        ? <DebtForm
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                        : <RepayAndWithdrawForm 
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      }
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FlashClose />
      </div>
      <div className="right-content">
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
    <div className="flash-close">
      <div className="section-title">
        <h3>Flash Close</h3>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </span>
        </div>
      </div>

      <div className="content">
        <div className="description">
          Use a flashloan to close your position, or just part of it.
          <br />
          <span className="bold">Fee: 1%</span>
        </div>

        <div className="actions">
          <button>Partial</button>
          <button>Total</button>
        </div>
      </div>
    </div>
  );
}

export default ManagePosition;
