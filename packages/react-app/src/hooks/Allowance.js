import { useState, useEffect } from 'react';
import usePoller from './Poller';

const DEBUG = false;

export default function useAllowance(contracts, asset, args, pollTime, formatter, onChange) {
  let adjustPollTime = 4000;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === 'number') {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args;
  }

  const [value, setValue] = useState();
  useEffect(() => {
    if (typeof onChange === 'function') {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  usePoller(
    async () => {
      if (contracts && contracts[asset.name] && asset.isERC20) {
        try {
          let newValue;
          if (DEBUG) console.log('CALLING ', asset.name, 'allowance', 'with args', args);
          if (args && args.length > 0 && args.indexOf('') === -1) {
            newValue = await contracts[asset.name].allowance(...args);
            if (DEBUG) console.log('contractName', asset.name, 'args', args, 'RESULT:', newValue);
          } else if (!args || (args && args.length === 0)) {
            newValue = await contracts[asset.name].allowance();
          }
          if (formatter && typeof formatter === 'function') {
            newValue = formatter(newValue);
          }
          // console.log("GOT VALUE",newValue)
          if (newValue !== value) {
            setValue(newValue);
          }
        } catch (e) {
          console.log(asset.name);
          console.log(e);
        }
      }
    },
    adjustPollTime,
    contracts,
  );

  return value;
}
