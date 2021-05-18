import { BigNumber } from "@ethersproject/bignumber";

export default async function GasEstimator(contract, method, params) {
  try {
    const _gasLimit = await contract.estimateGas[method](...params);
    // increase by 10%
    return _gasLimit.add(_gasLimit.div(BigNumber.from('10')));
  } catch(e) {
    return undefined;
  }
}
