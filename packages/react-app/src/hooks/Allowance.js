import { useState, useEffect } from 'react';
import { ASSETS } from 'consts';
import usePoller from './Poller';

const DEBUG = false;

export default function useAllowance(contracts, assetName, args, pollTime, formatter, onChange) {
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
      if (contracts && contracts[assetName] && ASSETS[assetName].isERC20) {
        try {
          let newValue;
          if (DEBUG) console.log('CALLING ', assetName, 'allowance', 'with args', args);
          if (args && args.length > 0 && args.indexOf('') === -1) {
            newValue = await contracts[assetName].allowance(...args);
            if (DEBUG) console.log('contractName', assetName, 'args', args, 'RESULT:', newValue);
          } else if (!args || (args && args.length === 0)) {
            newValue = await contracts[assetName].allowance();
          }
          if (formatter && typeof formatter === 'function') {
            newValue = formatter(newValue);
          }
          // console.log("GOT VALUE",newValue)
          if (newValue !== value) {
            setValue(newValue);
          }
        } catch (e) {
          console.log(assetName);
          console.log(e);
        }
      }
    },
    adjustPollTime,
    contracts,
  );

  return value;
}
