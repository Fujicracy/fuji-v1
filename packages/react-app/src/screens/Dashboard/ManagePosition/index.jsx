import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { VAULTS } from 'consts';
import { useContractReader } from '../../../hooks';

import FlashClose from '../FlashClose';
import DebtForm from '../DebtForm';
import CollateralForm from '../CollateralForm';
import SupplyAndBorrowForm from '../SupplyAndBorrowForm';
import RepayAndWithdrawForm from '../RepayAndWithdrawForm';
import PositionElement, { PositionActions } from '../../../components/PositionElement';
import CollaterizationIndicator from '../../../components/CollaterizationIndicator';
import ProvidersList from '../../../components/ProvidersList';

import './styles.css';

function ManagePosition({ contracts, provider, address }) {
  const defaultVault = Object.values(VAULTS)[0];

  const queries = new URLSearchParams(useLocation().search);

  // const [actionsType, setActionsType] = useState('single');
  const actionsType = 'single';

  const vaultAddress = queries?.get('vaultAddress')?.toLowerCase() || defaultVault?.address;

  const vault = VAULTS[vaultAddress];
  const borrowAssetName = vault?.borrowAsset.name;

  const position = {
    vaultAddress,
    debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      vault.borrowId,
    ]),
    collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      vault.collateralId,
    ]),
    borrowAsset: vault.borrowAsset,
    collateralAsset: vault.collateralAsset,
  };

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
            <div className="manage-my-position one-position">
              <PositionElement actionType={PositionActions.None} position={position} />

              <div className="manage-settings">
                {/* <div className="manage-mode">
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
                </div> */}

                <form noValidate>
                  <div className="manage-content">
                    <div className="col-50">
                      {actionsType === 'single' ? (
                        <CollateralForm
                          contracts={contracts}
                          provider={provider}
                          address={address}
                          position={position}
                        />
                      ) : (
                        <SupplyAndBorrowForm
                          borrowAsset={borrowAssetName}
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      )}
                    </div>
                    <div className="col-50">
                      {actionsType === 'single' ? (
                        <DebtForm
                          contracts={contracts}
                          provider={provider}
                          address={address}
                          position={position}
                        />
                      ) : (
                        <RepayAndWithdrawForm
                          borrowAsset={borrowAssetName}
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FlashClose
          position={position}
          contracts={contracts}
          provider={provider}
          address={address}
        />
      </div>
      <div className="right-content">
        <CollaterizationIndicator position={position} />
        <ProvidersList contracts={contracts} markets={[borrowAssetName]} isSelectable={false} />
      </div>
    </div>
  );
}

export default ManagePosition;
