/* eslint-disable no-await-in-loop */
import { useState, useEffect } from 'react';
import { useContractLoader, useAuth } from 'hooks';
import { TRANSACTION_TYPES, ASSETS, CHAIN_ID, CHAIN_IDS } from 'consts';
import { formatUnits } from '@ethersproject/units';

export default function useTransactionHistory(vaultName) {
  const [transactionHistories, setTransactionHistories] = useState([]);
  const contracts = useContractLoader();
  const { address, networkName } = useAuth();

  useEffect(() => {
    async function init() {
      if (contracts[vaultName]) {
        const histories = [];

        const events = [];

        let liquidator = null;
        if (CHAIN_ID === CHAIN_IDS.FANTOM) liquidator = contracts.FliquidatorFTM;
        else liquidator = contracts.Fliquidator;

        const liquidatorEvents = await contracts[vaultName].queryFilter(liquidator, address);
        events.push(...liquidatorEvents);

        console.log({ liquidatorEvents });

        try {
          for (let i = 0; i < TRANSACTION_TYPES.length; i += 1) {
            const evts = await contracts[vaultName].queryFilter(TRANSACTION_TYPES[i], address);
            console.log({ type: TRANSACTION_TYPES[i], evts });
            events.push(...evts);
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

        setTransactionHistories(histories);
      }
    }

    if (contracts && vaultName && address) {
      init();
    }
  }, [contracts, vaultName, address, networkName]);
  return transactionHistories;
}
