import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { useMediaQuery } from 'react-responsive';
import { Flex } from 'rebass';
import { Grid } from '@material-ui/core';

import { VAULTS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';

import FlashClose from '../FlashClose';
import DebtForm from '../DebtForm';
import CollateralForm from '../CollateralForm';
import SupplyAndBorrowForm from '../SupplyAndBorrowForm';
import RepayAndWithdrawForm from '../RepayAndWithdrawForm';
import PositionElement, { PositionActions } from '../../../components/PositionElement';
import CollaterizationIndicator from '../../../components/CollaterizationIndicator';
import ProvidersList from '../../../components/ProvidersList';

import { useContractReader } from '../../../hooks';

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
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minWidth={isMobile ? '320px' : isTablet ? '420px' : '1200px'}
        width={isMobile ? '320px' : isTablet ? '420px' : '1200px'}
        margin={isMobile ? '32px 28px' : isTablet ? '44px 144px' : '72px 20px 32px'}
      >
        <BlackBoxContainer hasBlackContainer={false} width={1} maxWidth="68rem">
          <Flex width={1 / 1} margin="0px 0px 16px">
            <Link to="my-positions" className="back-to-link">
              <ArrowBackIosOutlinedIcon style={{ fontSize: isMobile ? 16 : 18 }} />
              <SectionTitle marginLeft="8px" fontSize={isMobile ? '16px' : '18px'}>
                Back
              </SectionTitle>
            </Link>
          </Flex>
          <Grid container spacing={isMobile ? 3 : isTablet ? 4 : 6}>
            <Grid item md={8} sm={12} xs={12}>
              <BlackBoxContainer hasBlackContainer={false} ml={3} mb={3}>
                <Grid container>
                  <Grid item xs={4}>
                    {' '}
                  </Grid>
                  <Grid item xs={8}>
                    <Flex width={1 / 1}>
                      <SectionTitle
                        fontSize={isMobile ? '10px' : isTablet ? '14px' : '16px'}
                        justifyContent="center"
                        alignItems="center"
                        width="30%"
                      >
                        <>Collateral</>
                      </SectionTitle>
                      <SectionTitle
                        fontSize={isMobile ? '10px' : isTablet ? '14px' : '16px'}
                        justifyContent="center"
                        alignItems="center"
                        width="30%"
                      >
                        <>Debt</>
                      </SectionTitle>
                      <SectionTitle
                        fontSize={isMobile ? '10px' : isTablet ? '14px' : '16px'}
                        justifyContent="center"
                        alignItems="center"
                        width="40%"
                      >
                        <>Health Factor</>
                      </SectionTitle>
                    </Flex>
                  </Grid>
                </Grid>
              </BlackBoxContainer>
              {/* <span className="empty-button" /> */}
              <BlackBoxContainer
                hasBlackContainer
                noBottomBorderRadius
                noBottomBorder
                padding="12px 0px 12px 28px"
              >
                <PositionElement actionType={PositionActions.None} position={position} />
              </BlackBoxContainer>
              <BlackBoxContainer hasBlackContainer padding="28px" noTopBorderRadius>
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
              </BlackBoxContainer>
              {!isMobile && !isTablet && (
                <FlashClose
                  position={position}
                  contracts={contracts}
                  provider={provider}
                  address={address}
                />
              )}
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
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
            {(isMobile || isTablet) && (
              <Grid item md={4} sm={12} xs={12}>
                <FlashClose
                  position={position}
                  contracts={contracts}
                  provider={provider}
                  address={address}
                />
              </Grid>
            )}
          </Grid>
        </BlackBoxContainer>
      </Flex>
    </Flex>
  );
}

export default ManagePosition;
