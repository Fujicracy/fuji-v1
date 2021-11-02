import { hexlify } from '@ethersproject/bytes';

import Notify from 'bnc-notify';

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

const BLOCKNATIVE_KEY = process.env.REACT_APP_BLOCKNATIVE_KEY;

export default function Transactor(provider) {
  if (typeof provider !== 'undefined') {
    // eslint-disable-next-line consistent-return
    return async tx => {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      console.log('network', network);
      const options = {
        dappId: BLOCKNATIVE_KEY,
        system: 'ethereum',
        networkId: network.chainId,
        // darkMode: Boolean, // (default: false)
        transactionHandler: txInformation => {
          console.log('HANDLE TX', txInformation);
        },
      };
      const notify = Notify(options);

      let etherscanTxUrl = 'https://etherscan.io/tx/';
      if (network.chainId === 250) {
        etherscanTxUrl = 'https://ftmscan.com/tx/';
      }

      let dismissPendingWallet;
      try {
        let result;
        if (tx instanceof Promise) {
          const { dismiss } = notify.notification({
            type: 'pending',
            message: 'Please check your wallet: \n Transaction is waiting for confirmation!',
          });
          dismissPendingWallet = dismiss;
          console.log('AWAITING TX', tx);
          result = await tx;
          dismissPendingWallet();
        } else {
          if (!tx.gasLimit) {
            // eslint-disable-next-line no-param-reassign
            tx.gasLimit = hexlify(120000);
          }
          console.log('RUNNING TX', tx);
          result = await signer.sendTransaction(tx);
        }
        console.log('RESULT:', result);

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if ([1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0) {
          const { emitter } = notify.hash(result.hash);
          emitter.on('all', transaction => {
            return {
              link: `${etherscanTxUrl}${transaction.hash}`,
              autoDismiss: 10000,
            };
          });
        } else {
          const txHash = result.hash;
          notify.notification({
            type: 'success',
            message: `Transaction submitted:\n${txHash.slice(0, 8)}...${txHash.slice(-8)}`,
            onclick: () => window.open(`${etherscanTxUrl}${txHash}`, '_blank'),
            autoDismiss: 10000,
          });
        }

        return result;
      } catch (e) {
        console.log(e);
        dismissPendingWallet();

        let msg = e.message;
        if (e.data && e.data.message) {
          msg = e.data.message;
        } else if (e.message.startsWith('cannot estimate gas')) {
          msg = 'Transaction cannot be executed!';
        }
        notify.notification({
          type: 'error',
          message: `${msg}\nClick here to report this issue!`,
          autoDismiss: 10000,
          onclick: () => window.open('https://discord.gg/YbUX2vn7Vn', '_blank'),
        });
      }
    };
  }
}
