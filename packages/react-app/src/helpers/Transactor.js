import { hexlify } from "@ethersproject/bytes";
import { parseUnits } from "@ethersproject/units";
import { useSnackbar } from 'notistack';

import Notify from "bnc-notify";

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify

export default function Transactor(provider, gasPrice, etherscan) {
  if (typeof provider !== "undefined") {
    // eslint-disable-next-line consistent-return
    return async tx => {
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      console.log("network", network);
      const options = {
        dappId: "0b58206a-f3c0-4701-a62f-73c7243e8c77", // GET YOUR OWN KEY AT https://account.blocknative.com
        system: "ethereum",
        networkId: network.chainId,
        // darkMode: Boolean, // (default: false)
        transactionHandler: txInformation => {
          console.log("HANDLE TX", txInformation);
        },
      };
      const notify = Notify(options);

      let etherscanNetwork = "";
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + ".";
      }

      let etherscanTxUrl = "https://" + etherscanNetwork + "etherscan.io/tx/";
      if (network.chainId === 100) {
        etherscanTxUrl = "https://blockscout.com/poa/xdai/tx/";
      }

      let dismissPendingWallet;
      try {
        let result;
        if (tx instanceof Promise) {
          const { dismiss } = notify.notification({
            type: "pending",
            message: 'Please check your wallet: \n Transaction is waiting for confirmation!',
          });
          dismissPendingWallet = dismiss;
          console.log("AWAITING TX", tx);
          result = await tx;
          dismissPendingWallet();
        } else {
          if (!tx.gasPrice) {
            tx.gasPrice = gasPrice || parseUnits("4.1", "gwei");
          }
          if (!tx.gasLimit) {
            tx.gasLimit = hexlify(120000);
          }
          console.log("RUNNING TX", tx);
          result = await signer.sendTransaction(tx);
        }
        console.log("RESULT:", result);
        // console.log("Notify", notify);

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if ([1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0) {
          const { emitter } = notify.hash(result.hash);
          emitter.on("all", transaction => {
            return {
              link: (etherscan || etherscanTxUrl) + transaction.hash,
            };
          });
        } else {
          notify.notification({
            type: "success",
            message: `Local Transaction Sent: ${result.hash}`
          });
        }

        return result;
      } catch (e) {
        console.log(e);
        console.log("Transaction Error:", e.message);
        dismissPendingWallet();
        notify.notification({
          type: "error",
          message: `Transaction error: ${e.message}`
        });
      }
    };
  }
}
