import React from 'react'
import { useHistory } from 'react-router-dom'
import { formatUnits } from '@ethersproject/units'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'

import { useContractReader } from '../../hooks'
import { getBorrowId, getCollateralId } from '../../helpers'
import PositionElement, { PositionActions } from '../../components/PositionElement'
import ProvidersList from '../../components/ProvidersList'
import AlphaWarning from '../../components/AlphaWarning'

import './MyPositions.css'

function MyPositions({ contracts, address }) {
  const history = useHistory()

  const debtBalanceDai = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getBorrowId('DAI'),
  ])
  const collateralBalanceDai = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId('DAI'),
  ])

  const positionDai = {
    collateralBalance: collateralBalanceDai,
    debtBalance: debtBalanceDai,
    borrowAsset: 'DAI',
  }
  const loadingDaiPosition = positionDai.collateralBalance === undefined
  const hasDaiPosition =
    positionDai.collateralBalance && Number(formatUnits(positionDai.collateralBalance)) > 0

  const debtBalanceUsdc = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getBorrowId('USDC'),
  ])
  const collateralBalanceUsdc = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId('USDC'),
  ])

  const positionUsdc = {
    collateralBalance: collateralBalanceUsdc,
    debtBalance: debtBalanceUsdc,
    borrowAsset: 'USDC',
  }
  const loadingUsdcPosition = positionUsdc.collateralBalance === undefined
  const hasUsdcPosition =
    positionUsdc.collateralBalance && Number(formatUnits(positionUsdc.collateralBalance)) > 0

  return (
    <div className="container">
      <div className="left-content">
        <Grid container direction="column" justify="center" className="positions">
          <Typography variant="h3">My positions</Typography>
          <div className="position-board">
            {hasUsdcPosition || hasDaiPosition ? (
              <Grid item className="legend">
                <span className="empty-tab" />
                <div className="legend-elements">
                  <span>Collateral</span>
                  <span>Debt</span>
                  <span>Health Factor</span>
                </div>
                <span className="empty-button" />
              </Grid>
            ) : (
              <div style={{ height: '2.5rem' }} />
            )}
            {hasDaiPosition ? (
              <Grid item className="one-position">
                <PositionElement actionType={PositionActions.Manage} position={positionDai} />
              </Grid>
            ) : (
              ''
            )}
            {hasUsdcPosition ? (
              <Grid item className="one-position">
                <PositionElement actionType={PositionActions.Manage} position={positionUsdc} />
              </Grid>
            ) : (
              ''
            )}
            {loadingDaiPosition && ''}
            {!loadingDaiPosition && !hasDaiPosition ? (
              <Grid
                item
                onClick={() => {
                  return history.push('/dashboard/init-borrow?borrowAsset=DAI')
                }}
                className="adding-position"
              >
                <AddIcon />
                Borrow DAI
              </Grid>
            ) : (
              ''
            )}
            {loadingUsdcPosition && ''}
            {!loadingUsdcPosition && hasUsdcPosition ? (
              <Grid
                item
                onClick={() => {
                  return history.push('/dashboard/init-borrow?borrowAsset=USDC')
                }}
                className="adding-position"
              >
                <AddIcon />
                Borrow USDC
              </Grid>
            ) : (
              ''
            )}
          </div>
        </Grid>
      </div>
      <div className="right-content">
        <AlphaWarning />
        <ProvidersList contracts={contracts} markets={['DAI', 'USDC']} />
      </div>
    </div>
  )
}

export default MyPositions
