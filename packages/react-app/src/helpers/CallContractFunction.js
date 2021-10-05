const DEBUG = false;

export async function CallContractFunction(contracts, contractName, functionName, args, formatter) {
  let value = 0;
  console.log({ contractName, functionName, args });
  if (contracts && contracts[contractName]) {
    try {
      if (DEBUG) console.log('CALLING ', contractName, functionName, 'with args', args);
      if (args && args.length > 0 && args.indexOf('') === -1) {
        value = await contracts[contractName][functionName](...args);
        if (DEBUG)
          console.log(
            'contractName',
            contractName,
            'functionName',
            functionName,
            'args',
            args,
            'RESULT:',
            value,
          );
      } else if (!args || (args && args.length === 0)) {
        value = await contracts[contractName][functionName]();
      }
      if (formatter && typeof formatter === 'function') {
        value = formatter(value);
      }
    } catch (e) {
      console.log(contractName);
      console.log(e);
    }
  }

  return value;
}

export async function getUserBalance(
  provider,
  address,
  contracts = null,
  assetName = '',
  isERC20 = false,
) {
  if (address && provider) {
    const newBalance = isERC20
      ? await contracts[assetName].balanceOf(address)
      : await provider.getBalance(address);
    return newBalance;
  }

  return 0;
}
