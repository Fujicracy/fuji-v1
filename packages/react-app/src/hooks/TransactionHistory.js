/* eslint-disable no-await-in-loop */
import { useState, useEffect } from 'react';
import { useContractLoader, useAuth } from 'hooks';
import { ASSETS, CHAIN_IDS } from 'consts';
import { formatUnits } from '@ethersproject/units';

export default function useTransactionHistory(vaultName) {
  const [transactionHistories, setTransactionHistories] = useState([]);
  const contracts = useContractLoader();
  const { address, networkName, networkId } = useAuth();

  useEffect(() => {
    async function init() {
      if (contracts[vaultName]) {
        const histories = [];

        const events = [];

        let liquidator = null;
        if (networkId === CHAIN_IDS.FANTOM) liquidator = contracts.FliquidatorFTM;
        else liquidator = contracts.Fliquidator;

        const liquidatorEvents = await contracts[vaultName].queryFilter(liquidator, address);
        events.push(...liquidatorEvents);

        try {
          const filterBorrows = contracts[vaultName].filters.Borrow(address);
          const borrowEvents = await contracts[vaultName].queryFilter(filterBorrows);
          events.push(...borrowEvents);

          const filterDeposit = contracts[vaultName].filters.Deposit(address);
          const depositEvents = await contracts[vaultName].queryFilter(filterDeposit);
          events.push(...depositEvents);

          const filterWithdraw = contracts[vaultName].filters.Withdraw(address);
          const withdrawEvents = await contracts[vaultName].queryFilter(filterWithdraw);
          events.push(...withdrawEvents);

          const filterPayback = contracts[vaultName].filters.Payback(address);
          const paybackEvents = await contracts[vaultName].queryFilter(filterPayback);
          events.push(...paybackEvents);

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

        setTransactionHistories(histories);
      }
    }

    if (contracts && vaultName && address) {
      init();
    }
  }, [contracts, vaultName, address, networkName, networkId]);
  return transactionHistories;
}
