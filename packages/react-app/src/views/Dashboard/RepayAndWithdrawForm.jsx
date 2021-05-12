import React, { useState } from 'react'
import get from 'lodash/get'
import { formatUnits, parseUnits, parseEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import CircularProgress from '@material-ui/core/CircularProgress'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Transactor, getVaultName } from '../../helpers'
import { useContractReader } from '../../hooks'

function RepayAndWithdrawForm({ borrowAsset, contracts, provider, address }) {
  const { register, errors, handleSubmit } = useForm()
  const tx = Transactor(provider)

  const [borrowAmount, setBorrowAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useState({ step: null, withApproval: false })

  const decimals = borrowAsset === 'USDC' ? 6 : 18

  // const debtBalance = useContractReader(
  // contracts,
  // borrowAsset === "DAI" ? "DebtToken-DAI" : "DebtToken-USDC",
  // "balanceOf",
  // [address]
  // );

  const balance = useContractReader(contracts, borrowAsset, 'balanceOf', [address])
  const allowance = useContractReader(contracts, borrowAsset, 'allowance', [
    address,
    contracts ? contracts[getVaultName(borrowAsset)].address : '0x',
  ])

  const paybackAndWithdraw = async withApproval => {
    const res = await tx(
      contracts[getVaultName(borrowAsset)].paybackAndWithdraw(
        parseUnits(borrowAmount, decimals),
        parseEther(collateralAmount),
        { gasPrice: parseUnits('40', 'gwei') },
      ),
    )

    if (res && res.hash) {
      const receipt = await res.wait()
      if (
        receipt &&
        receipt.events &&
        receipt.events.find(e => {
          return e.event === 'Repay'
        })
      ) {
        setDialog({ step: 'success', withApproval })
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false })
    }
    setLoading(false)
  }

  const approve = async infiniteApproval => {
    const base = BigNumber.from(2)
    const e = BigNumber.from(256)
    const approveAmount = infiniteApproval ? base.pow(e).sub(1) : parseUnits(borrowAmount, decimals)

    setDialog({ step: 'approvalPending', withApproval: true })
    const res = await tx(
      contracts[borrowAsset].approve(
        contracts[getVaultName(borrowAsset)].address,
        BigNumber.from(approveAmount),
        { gasPrice: parseUnits('40', 'gwei') },
      ),
    )

    if (res && res.hash) {
      const receipt = await res.wait()
      if (
        receipt &&
        receipt.events &&
        receipt.events.find(err => {
          return err.event === 'Approval'
        })
      ) {
        paybackAndWithdraw(true)
      }
    } else {
      // error
      setDialog({ step: null, withApproval: false })
    }
  }

  const onSubmit = async () => {
    setLoading(true)

    if (parseUnits(borrowAmount, decimals) > Number(allowance)) {
      setDialog({ step: 'approval', withApproval: true })
    } else {
      paybackAndWithdraw(false)
    }
  }

  const dialogContents = {
    approval: {
      title: 'Approving... 1 of 2',
      content: 'You need first to approve a spending limit.',
      actions: () => {
        return (
          <DialogActions>
            <Button
              onClick={() => {
                return approve(false)
              }}
              className="main-button"
            >
              Approve {borrowAmount} {borrowAsset}
            </Button>
            <Button
              onClick={() => {
                return approve(true)
              }}
              className="main-button"
            >
              Infinite Approve
            </Button>
          </DialogActions>
        )
      },
    },
    success: {
      title: 'Success',
      content: 'Your transaction has been processed.',
      actions: () => {
        return (
          <DialogActions>
            <Button
              onClick={() => {
                setDialog({ step: null, withApproval: false })
                setBorrowAmount('')
                setCollateralAmount('')
              }}
              className="main-button"
            >
              Close
            </Button>
          </DialogActions>
        )
      },
    },
  }

  const getBtnContent = () => {
    if (!loading) {
      return 'Submit'
    }

    if (dialog.step === 'approvalPending') {
      return 'Approving... 1 of 2'
    }

    return `Processing... ${dialog.withApproval ? '2 of 2' : ''}`
  }

  return (
    <Grid container direction="column">
      <Dialog
        open={dialog.step === 'approval' || dialog.step === 'success'}
        aria-labelledby="form-dialog-title"
      >
        <button
          type="button"
          className="close"
          onClick={() => {
            setDialog({ step: null, withApproval: false })
            setLoading(false)
          }}
        >
          <HighlightOffIcon />
        </button>
        <DialogTitle id="form-dialog-title">
          {get(dialogContents[dialog.step], 'title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{get(dialogContents[dialog.step], 'content')}</DialogContentText>
        </DialogContent>
        {get(dialogContents[dialog.step], 'actions') && dialogContents[dialog.step].actions()}
      </Dialog>
      <Grid item className="section-title">
        <Typography variant="h3">Repay & Withdraw</Typography>
        <div className="tooltip-info">
          <InfoOutlinedIcon />
          <span className="tooltip tooltip-top">
            <span className="bold">Repay</span> from your wallet balance and
            <span className="bold"> withdraw</span> your colaterall in a single transaction.
          </span>
        </div>
      </Grid>
      <Grid item>
        <div className="subtitle">
          <span className="complementary-infos">
            Balance: {balance ? formatUnits(balance, decimals) : '...'} {borrowAsset} Ξ
          </span>
        </div>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            id="repayAmount"
            name="borrowAmount"
            type="number"
            step="any"
            variant="outlined"
            onChange={({ target }) => {
              return setBorrowAmount(target.value)
            }}
            inputRef={register({ required: true, min: 0 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt={borrowAsset} src={`/${borrowAsset}.png`} className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    {borrowAsset}
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {get(errors, 'borrowAmount') && (
          <Typography variant="body2">
            <div className="error-input-msg">Please, type the amount you like to repay!</div>
          </Typography>
        )}
      </Grid>
      <Grid item>
        <div className="fake-input">
          <TextField
            className="input-container"
            required
            fullWidth
            autoComplete="off"
            name="collateralAmount"
            type="number"
            step="any"
            id="withdrawAmount"
            variant="outlined"
            onChange={({ target }) => {
              return setCollateralAmount(target.value)
            }}
            inputRef={register({ required: true, min: 0 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Avatar alt="ETH" src="/ETH.png" className="icon" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body1" className="input-infos">
                    ETH
                  </Typography>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {get(errors, 'amount') && (
          <Typography variant="body2">
            <div className="error-input-msg">Please, type the amount you like to withdraw!</div>
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="main-button"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                style={{ width: 25, height: 25, marginRight: '10px', color: 'rgba(0, 0, 0, 0.26)' }}
              />
            ) : (
              ''
            )
          }
        >
          {getBtnContent()}
        </Button>
      </Grid>
    </Grid>
  )
}

export default RepayAndWithdrawForm
