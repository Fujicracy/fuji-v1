import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation, Trans } from 'react-i18next';
import { formatUnits } from '@ethersproject/units';
import { Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CallContractFunction } from 'helpers';
import { Flex } from 'rebass';
import { map, orderBy } from 'lodash';

import { useAuth, useResources, useContractLoader } from 'hooks';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { PositionElement, PositionActions, ProvidersList, SelectMarket, Label } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES, CHAIN_NAMES } from 'consts';
import { GridContainer, GridNewPosition, PositionsBoard, GridOnePosition } from './styles';

function MyPositions() {
  const history = useHistory();

  const { address, networkName } = useAuth();
  const contracts = useContractLoader();
  const { vaults } = useResources();

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  const [positions, setPositions] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;
    async function setup() {
      const tmpPositions = [];
      for (let i = 0; i < vaults.length; i += 1) {
        const vault = vaults[i];
        // eslint-disable-next-line no-await-in-loop
        const debtBalance = await CallContractFunction(contracts, 'FujiERC1155', 'balanceOf', [
          address,
          vault.borrowId,
        ]);
        // eslint-disable-next-line no-await-in-loop
        const collateralBalance = await CallContractFunction(
          contracts,
          'FujiERC1155',
          'balanceOf',
          [address, vault.collateralId],
        );
        const position = {
          vaultAddress: contracts?.[vault.name]?.address,
          vault,
          debtBalance,
          collateralBalance,
        };
        tmpPositions.push(position);
      }
      if (mounted) setPositions(tmpPositions);
    }

    if (contracts && address) setup();
    return () => {
      mounted = false;
    };
  }, [vaults, contracts, address]);

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
      <GridContainer container spacing={6}>
        {(isMobile || isTablet) && networkName !== CHAIN_NAMES.FANTOM && (
          <Grid item xs={12} sm={12} md={4}>
            <BlackBoxContainer
              hasBlackContainer
              padding={isMobile ? '32px 28px' : '44px 36px 40px'}
            >
              <SelectMarket />
            </BlackBoxContainer>
          </Grid>
        )}
        <Grid item md={8} sm={12} xs={12}>
          <Grid container direction="column" justifyContent="center">
            <SectionTitle fontSize={isMobile ? '14px' : isTablet ? '24px' : '16px'}>
              <Trans i18nKey="global.myPositions" t={t}>
                My positions
              </Trans>
            </SectionTitle>
            <PositionsBoard>
              {hasPosition() ? (
                <Grid item>
                  <BlackBoxContainer
                    hasBlackContainer={false}
                    ml="20px"
                    mb={3}
                    mr={!isMobile && !isTablet && '28px'}
                  >
                    <Grid container>
                      <Grid item xs={5} md={3}>
                        {' '}
                      </Grid>
                      <Grid item xs={7} md={7}>
                        <Flex width={1 / 1}>
                          <SectionTitle
                            fontSize={isMobile ? '8px' : isTablet ? '14px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="30%"
                          >
                            <Trans i18nKey="global.collateral" t={t}>
                              Collateral
                            </Trans>
                          </SectionTitle>
                          <SectionTitle
                            fontSize={isMobile ? '8px' : isTablet ? '14px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="30%"
                          >
                            <Trans i18nKey="global.debt" t={t}>
                              Debt
                            </Trans>
                          </SectionTitle>
                          <SectionTitle
                            fontSize={isMobile ? '8px' : isTablet ? '14px' : '16px'}
                            justifyContent="center"
                            alignItems="center"
                            width="40%"
                            textAlign="center"
                          >
                            <Trans i18nKey="healthFactor.title" t={t}>
                              Health Factor
                            </Trans>
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
                    <GridOnePosition
                      key={`${position.vault.borrowAsset.name}-${position.vault.collateralAsset.name}`}
                      item
                      onClick={() =>
                        isMobile || isTablet
                          ? history.push(
                              `/dashboard/position?vaultAddress=${position.vaultAddress}`,
                            )
                          : undefined
                      }
                    >
                      <PositionElement actionType={PositionActions.Manage} position={position} />
                    </GridOnePosition>
                  ),
              )}
              <GridNewPosition item onClick={() => history.push(`/dashboard/init-borrow`)}>
                <AddIcon />
                <Label lineHeight="125%">
                  <Trans i18nKey="global.borrow" t={t}>
                    Borrow
                  </Trans>
                </Label>
              </GridNewPosition>
            </PositionsBoard>
          </Grid>
        </Grid>
        {!isMobile && !isTablet && (
          <Grid item xs={12} sm={12} md={4}>
            <BlackBoxContainer hasBlackContainer padding="32px 28px">
              <Grid container spacing={4}>
                {networkName !== CHAIN_NAMES.FANTOM && (
                  <Grid item xs={8} sm={8} md={12}>
                    <SelectMarket />
                  </Grid>
                )}
                <Grid item xs={4} sm={4} md={12}>
                  <ProvidersList
                    markets={markets}
                    title="APR"
                    isDropDown
                    hasBlackContainer={false}
                  />
                </Grid>
              </Grid>
            </BlackBoxContainer>
          </Grid>
        )}
      </GridContainer>
    </Flex>
  );
}

export default MyPositions;
