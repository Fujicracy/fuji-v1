import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { useMediaQuery } from 'react-responsive';
import { Flex } from 'rebass';
import { Grid } from '@material-ui/core';

import { VAULTS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
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
  // const defaultVault = Object.values(VAULTS)[0];

  const queries = new URLSearchParams(useLocation().search);
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });
  // const [actionsType, setActionsType] = useState('single');
  const actionsType = 'single';

  const vaultAddress = queries?.get('vaultAddress')?.toLowerCase() || Object.keys(VAULTS)[0];

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
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <Grid container className="positions-container" spacing={isMobile ? 4 : 6}>
        <Grid item md={8} sm={8} xs={12}>
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
              <div className="one-manage-position">
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
                    <Grid container className="manage-content" spacing={4}>
                      <Grid item md={6} xs={12}>
                        {actionsType === 'single' ? (
                          <CollateralForm
                            contracts={contracts}
                            provider={provider}
                            address={address}
                            position={position}
                          />
                        ) : (
                          <SupplyAndBorrowForm
                            contracts={contracts}
                            provider={provider}
                            address={address}
                            position={position}
                          />
                        )}
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {actionsType === 'single' ? (
                          <DebtForm
                            contracts={contracts}
                            provider={provider}
                            address={address}
                            position={position}
                          />
                        ) : (
                          <RepayAndWithdrawForm
                            contracts={contracts}
                            provider={provider}
                            address={address}
                            position={position}
                          />
                        )}
                      </Grid>
                    </Grid>
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
        </Grid>
        <Grid item md={4} sm={4} xs={12}>
          <Grid container direction="column" spacing={isMobile ? 4 : 6}>
            <Grid item>
              <CollaterizationIndicator position={position} />
            </Grid>
            {!isMobile && !isTablet && (
              <Grid item>
                <ProvidersList
                  contracts={contracts}
                  markets={[borrowAssetName]}
                  isSelectable={false}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Flex>
  );
}

export default ManagePosition;
