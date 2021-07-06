import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { find } from 'lodash';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { VAULTS } from 'constants/vaults';
import { useContractReader } from '../../../hooks';

// import { getBorrowId, getCollateralId } from '../../../helpers';
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
  const queries = new URLSearchParams(useLocation().search);

  // const [actionsType, setActionsType] = useState('single');
  const actionsType = 'single';
  // const [borrowAmount, setBorrowAmount] = useState(0);
  // const [collateralAmount, setCollateralAmount] = useState('');

  const borrowAsset = queries?.get('borrowAssetName') || 'DAI';
  const vault = find(VAULTS, v => v.borrowAsset.name === borrowAsset);
  const position = {
    // debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    //   address,
    //   getBorrowId(borrowAsset),
    // ]),
    // collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    //   address,
    //   getCollateralId(borrowAsset),
    // ]),
    // borrowAsset,
    // decimals: ASSETS[borrowAsset].decimals,

    vaultAddress: Object.keys(vault)?.[0],
    debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      // getBorrowId(vault.borrowAsset.name), // 5 for usdt and 3 for usdc
      vault.borrowId,
    ]),
    collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
      address,
      // getCollateralId(vault.borrowAsset.name),
      vault.collateralId,
    ]),
    // borrowAsset: vault.borrowAsset.name,
    // decimals: vault.borrowAsset.decimals,
    borrowAsset: vault.borrowAsset,
    collateralAsset: vault.collateralAsset,
  };

  // const decimals = borrowAsset === "USDC" ? 6 : 18;

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
                          borrowAsset={borrowAsset}
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      ) : (
                        <SupplyAndBorrowForm
                          borrowAsset={borrowAsset}
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      )}
                    </div>
                    <div className="col-50">
                      {actionsType === 'single' ? (
                        <DebtForm
                          borrowAsset={borrowAsset}
                          contracts={contracts}
                          provider={provider}
                          address={address}
                        />
                      ) : (
                        <RepayAndWithdrawForm
                          borrowAsset={borrowAsset}
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
          borrowAsset={borrowAsset}
          contracts={contracts}
          provider={provider}
          address={address}
        />
      </div>
      <div className="right-content">
        <CollaterizationIndicator position={position} />
        <ProvidersList contracts={contracts} markets={[borrowAsset]} />
      </div>
    </div>
  );
}

export default ManagePosition;
