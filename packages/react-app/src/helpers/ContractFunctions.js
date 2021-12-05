import { formatUnits } from '@ethersproject/units';
import { CHAINLINK_ABI } from 'consts/abis';
import { Contract } from '@ethersproject/contracts';

const DEBUG = false;

export async function CallContractFunction(contracts, contractName, functionName, args, formatter) {
  let value = 0;
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
      console.log(`Unsuccessful call to ${contractName}`);
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
    try {
      const newBalance = isERC20
        ? await contracts[assetName].balanceOf(address)
        : await provider.getBalance(address);
      return newBalance;
    } catch (e) {
      console.log('Unsuccessful getUserBalance call');
    }
  }

  return 0;
}

async function getExternalContractLoader(provider, address, ABI, optionalBytecode) {
  if (typeof provider !== 'undefined' && address && ABI) {
    try {
      // we need to check to see if this provider has a signer or not
      let signer;
      const accounts = await provider.listAccounts();
      if (accounts && accounts.length > 0) {
        signer = provider.getSigner();
      } else {
        signer = provider;
      }

      const customContract = new Contract(address, ABI, signer);
      if (optionalBytecode) customContract.bytecode = optionalBytecode;

      return customContract;
    } catch (e) {
      console.log(
        'ERROR LOADING EXTERNAL CONTRACT AT ' + address + ' (check provider, address, and ABI)!!',
        e,
      );
    }
  }
  return null;
}

export async function getExchangePrice(provider, asset) {
  const priceFeedProxy = asset.oracle;

  const oracle = await getExternalContractLoader(provider, priceFeedProxy, CHAINLINK_ABI);

  if (oracle) {
    try {
      const r = await oracle.latestRoundData();
      const price = parseFloat(formatUnits(r.answer, 8));
      return price;
    } catch (e) {
      console.log('Unsuccessful getExchangePrice call');
    }
  }

  return 0;
}
