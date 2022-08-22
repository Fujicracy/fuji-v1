/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { useContractLoader, useAuth } from 'hooks';
import { ASSETS, CHAIN_IDS, TRANSACTION_ACTIONS, CHAIN_NAMES, CHAIN_NAME } from 'consts';
import { formatUnits } from '@ethersproject/units';
import usePoller from './Poller';

export default function useTransactionHistory(vaultName, action, pollTime = 4000) {
  const [transactionHistories, setTransactionHistories] = useState(undefined);
  const contracts = useContractLoader();
  const { address, networkName, networkId } = useAuth();

  useEffect(() => setTransactionHistories(undefined), [vaultName, action]);

  usePoller(
    async () => {
      if (!contracts || !vaultName || !address) {
        return;
      }

      const vaultContract = contracts[vaultName];
      if (!vaultContract) {
        return;
      }

      const events = [];
      try {
        if (action === TRANSACTION_ACTIONS.ALL || action === TRANSACTION_ACTIONS.LIQUIDATION) {
          let liquidatorEvents;
          if (networkId === CHAIN_IDS.FANTOM || CHAIN_NAME === CHAIN_NAMES.FANTOM) {
            const filterLiquidator = contracts.FliquidatorFTM.filters.Liquidate(address);
            liquidatorEvents = await contracts.FliquidatorFTM.queryFilter(filterLiquidator);
          } else if (networkId === CHAIN_IDS.POLYGON || CHAIN_NAME === CHAIN_NAMES.POLYGON) {
            const filterLiquidator = contracts.F2FliquidatorMATIC.filters.Liquidate(address);
            liquidatorEvents = await contracts.F2FliquidatorMATIC.queryFilter(filterLiquidator);
          } else {
            const filterLiquidator = contracts.Fliquidator.filters.Liquidate(address);
            liquidatorEvents = await contracts.Fliquidator.queryFilter(filterLiquidator);
          }
          events.push(...liquidatorEvents);
        }

        const vaultEvents = [
          TRANSACTION_ACTIONS.BORROW,
          TRANSACTION_ACTIONS.DEPOSIT,
          TRANSACTION_ACTIONS.WITHDRAW,
          TRANSACTION_ACTIONS.PAYBACK,
        ];
        const toRetrieve =
          action === TRANSACTION_ACTIONS.ALL
            ? vaultEvents
            : vaultEvents.filter(eventName => eventName === action);

        for (const eventName of toRetrieve) {
          const filtered = vaultContract.filters[eventName](address);
          const events = await vaultContract.queryFilter(filtered);
          events.push(...events);
        }

        const histories = [];
        for (let j = 0; j < events.length; j += 1) {
          const history = {};
          const evt = events[j];
          const block = await evt.getBlock(evt.blockNumber);

          history.Date = new Date(block.timestamp * 1000);
          history.Action = evt.event;
          history.txHash = evt.transactionHash;
          history.Asset = Object.keys(ASSETS[networkName]).find(
            key => ASSETS[networkName][key].address.toLowerCase() === evt.args.asset.toLowerCase(),
          );
          if (history.Asset) {
            history.Amount = Number(
              formatUnits(evt.args.amount, ASSETS[networkName][history.Asset].decimals),
            );
          }

          histories.push(history);
        }
      } catch (error) {
        console.error('useTransactionHistory error:', { error });
      }

      histories.sort((x, y) => y.Date.valueOf() - x.Date.valueOf());
      setTransactionHistories(histories);
    },
    pollTime,
    vaultName,
  );

  return { transactionHistories };
}
