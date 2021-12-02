import { useState } from 'react';
import usePoller from './Poller';

export default function useBalance(
  provider,
  address,
  contracts = null,
  assetName = '',
  isERC20 = false,
  pollTime = 4000,
) {
  const [balance, setBalance] = useState();
  const pollBalance = async () => {
    if (address && provider && contracts) {
      try {
        const newBalance = isERC20
          ? await contracts[assetName].balanceOf(address)
          : await provider.getBalance(address);
        if (newBalance !== balance) {
          // console.log("NEW BALANCE:",newBalance,"Current balance",balance)
          setBalance(newBalance);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  usePoller(pollBalance, pollTime, address && provider);

  return balance;
}
