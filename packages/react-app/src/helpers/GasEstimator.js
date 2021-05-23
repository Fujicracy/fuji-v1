import { BigNumber } from '@ethersproject/bignumber';

export default async function GasEstimator(contract, method, params) {
  try {
    const gasLimit = await contract.estimateGas[method](...params);
    // increase by 10%
    return gasLimit.add(gasLimit.div(BigNumber.from('10')));
  } catch (e) {
    return undefined;
  }
}
