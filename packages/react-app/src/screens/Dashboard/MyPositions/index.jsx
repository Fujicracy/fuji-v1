/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import { useHistory } from 'react-router-dom';
import { formatUnits } from '@ethersproject/units';
import { Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useAuth, useResources, useContractLoader, useContractReader } from 'hooks';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';

import { PositionElement, PositionActions, ProvidersList } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import './styles.css';

function MyPositions() {
  const { address } = useAuth();
  const contracts = useContractLoader();
  const { vaults } = useResources();

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const history = useHistory();
  const positions = map(vaults, vault => {
    return {
      vault,
      vaultAddress: contracts?.[vault.name]?.address,
      debtBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        vault.borrowId,
      ]),
      collateralBalance: useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
        address,
        vault.collateralId,
      ]),
    };
  });

  const markets = [...new Set(map(vaults, v => v.borrowAsset.name))];

  const hasPosition = position => {
    if (position) {
      const vault = position.vault;
      return (
        position.collateralBalance &&
        Number(formatUnits(position.collateralBalance, vault.collateralAsset.decimals)) > 0
      );
    }

    for (let i = 0; i < positions.length; i += 1) {
      const decimals = positions[i].vault.collateralAsset?.decimals;
      if (
        positions[i]?.collateralBalance &&
        Number(formatUnits(positions[i].collateralBalance, decimals)) > 0
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <Flex flex flexDirection="row" justifyContent="center">
      <Grid container className="positions-container" spacing={isMobile ? 1 : 6}>
        <Grid item md={8} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="center" className="positions">
            <SectionTitle fontSize={isMobile ? '14px' : isTablet ? '24px' : '16px'}>
              {' '}
              My positions
            </SectionTitle>
            <div className="position-board">
              {hasPosition() ? (
                <Grid item>
                  {/* <span className="empty-tab" /> */}
                  <BlackBoxContainer
                    hasBlackContainer={false}
                    ml="28px"
                    mb={3}
                    mr={!isMobile && !isTablet && '28px'}
                  >
                    <Grid container>
                      <Grid item xs={4} md={3}>
                        {' '}
                      </Grid>
                      <Grid item xs={8} md={7}>
                        <Flex width={1 / 1}>
                          <SectionTitle
                            fontSize={isMobile ? '10px' : isTablet ? '18px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="30%"
                          >
                            <>Collateral</>
                          </SectionTitle>
                          <SectionTitle
                            fontSize={isMobile ? '10px' : isTablet ? '18px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="30%"
                          >
                            <>Debt</>
                          </SectionTitle>
                          <SectionTitle
                            fontSize={isMobile ? '10px' : isTablet ? '18px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="40%"
                          >
                            <>Health Factor</>
                          </SectionTitle>
                        </Flex>
                      </Grid>
                      <Grid item md={2}>
                        {' '}
                      </Grid>
                    </Grid>
                  </BlackBoxContainer>
                  {/* <span className="empty-button" /> */}
                </Grid>
              ) : isMobile ? (
                <></>
              ) : (
                <div style={{ height: '2.5rem' }} />
              )}
              {map(
                orderBy(
                  positions,
                  item =>
                    Number(
                      formatUnits(item?.collateralBalance || 0, item?.vault.borrowAsset.decimals),
                    ),
                  'desc',
                ),
                position =>
                  hasPosition(position) && (
                    <Grid
                      key={`${position.vault.borrowAsset.name}-${position.vault.collateralAsset.name}`}
                      item
                      className="one-position"
                      onClick={() => {
                        return (
                          (isMobile || isTablet) &&
                          history.push(`/dashboard/position?vaultAddress=${position.vaultAddress}`)
                        );
                      }}
                    >
                      <PositionElement actionType={PositionActions.Manage} position={position} />
                    </Grid>
                  ),
              )}
              <Grid
                item
                onClick={() => history.push(`/dashboard/init-borrow`)}
                className="adding-position"
              >
                <AddIcon />
                Borrow
              </Grid>
            </div>
          </Grid>
        </Grid>
        {!isMobile && !isTablet && (
          <Grid item md={4} sm={4}>
            <ProvidersList markets={markets} />
          </Grid>
        )}
      </Grid>
    </Flex>
  );
}

export default MyPositions;
