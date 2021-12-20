/* eslint-disable no-await-in-loop */
import { useState } from 'react';
import { useContractLoader, useAuth } from 'hooks';
import { ASSETS, CHAIN_IDS, TRANSACTION_ACTIONS } from 'consts';
import { formatUnits } from '@ethersproject/units';
import usePoller from './Poller';

export default function useTransactionHistory(vaultName, action, pollTime = 4000) {
  const [transactionHistories, setTransactionHistories] = useState([]);
  const contracts = useContractLoader();
  const { address, networkName, networkId } = useAuth();

  usePoller(
    async () => {
      if (contracts && vaultName && address) {
        const vaultContract = contracts[vaultName];
        if (vaultContract) {
          const histories = [];

          const events = [];

          try {
            if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.LIQUIDATION) {
              let liquidatorEvents;
              if (networkId === CHAIN_IDS.FANTOM) {
                const filterLiquidator = contracts.FliquidatorFTM.filters.Liquidate(address);
                liquidatorEvents = await contracts.FliquidatorFTM.queryFilter(filterLiquidator);
              } else {
                const filterLiquidator = contracts.Fliquidator.filters.Liquidate(address);
                liquidatorEvents = await contracts.Fliquidator.queryFilter(filterLiquidator);
              }

              events.push(...liquidatorEvents);
            }

            if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.BORROW) {
              const filterBorrows = vaultContract.filters.Borrow(address);
              const borrowEvents = await vaultContract.queryFilter(filterBorrows);
              events.push(...borrowEvents);
            }

            if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.DEPOSIT) {
              const filterDeposit = vaultContract.filters.Deposit(address);
              const depositEvents = await vaultContract.queryFilter(filterDeposit);
              events.push(...depositEvents);
            }

            if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.WITHDRAW) {
              const filterWithdraw = vaultContract.filters.Withdraw(address);
              const withdrawEvents = await vaultContract.queryFilter(filterWithdraw);
              events.push(...withdrawEvents);
            }

            if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.PAYBACK) {
              const filterPayback = vaultContract.filters.Payback(address);
              const paybackEvents = await vaultContract.queryFilter(filterPayback);
              events.push(...paybackEvents);
            }

            for (let j = 0; j < events.length; j += 1) {
              const history = {};

              const evt = events[j];
              const block = await evt.getBlock(evt.blockNumber);

              history.Date = new Date(block.timestamp * 1000);
              history.Action = evt.event;

              history.Asset = Object.keys(ASSETS[networkName]).find(
                key =>
                  ASSETS[networkName][key].address.toLowerCase() === evt.args.asset.toLowerCase(),
              );

              if (history.Asset) {
                history.Amount = Number(
                  formatUnits(evt.args.amount, ASSETS[networkName][history.Asset].decimals),
                );
              }

              history.txHash = evt.transactionHash;

              histories.push(history);
              console.log({ histories, events });
            }
          } catch (error) {
            console.error('useTransactionHistory error:', { error });
          }

          histories.sort((x, y) => x.Date.valueOf() - y.Date.valueOf());
          setTransactionHistories(histories);
        }
      }
    },
    pollTime,
    vaultName,
  );

  return transactionHistories;
}
