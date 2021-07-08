// SPDX-License-Identifier: MIT

pragma solidity >=0.6.12 <0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol"; //test line

interface IComptroller {
  function claimComp(address holder) external;
}

interface IAaveLiquidityMining {
  function claimRewards(
    address[] calldata assets,
    uint256 amount,
    address to
  ) external returns (uint256);

  function getUserUnclaimedRewards(address _user) external view returns (uint256);

  function getRewardsBalance(address[] calldata assets, address user)
    external
    view
    returns (uint256);
}

contract VaultHarvester {
  address[] public aaveClaimAddrs;
  IAaveLiquidityMining private _aaVeLM =
    IAaveLiquidityMining(0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5);
  IComptroller private _comppTLR = IComptroller(0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B);

  constructor() {
    aaveClaimAddrs.push(address(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e)); // aWETH
    aaveClaimAddrs.push(address(0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf)); // variableDebtWETH
    aaveClaimAddrs.push(address(0x6C3c78838c761c6Ac7bE9F59fe808ea2A6E4379d)); // variableDebtDAI
    aaveClaimAddrs.push(address(0x619beb58998eD2278e08620f97007e1116D5D25b)); // variableDebtUSDC
    aaveClaimAddrs.push(address(0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec)); // variableDebtUSDT
    aaveClaimAddrs.push(address(0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656)); // awBTC
    aaveClaimAddrs.push(address(0x9c39809Dec7F95F5e0713634a4D0701329B3b4d2)); // variableDebtwBTC
  }

  /**
   * @dev Called by the Vault to harvest farmed tokens at baselayer Protocols
   * @param _farmProtocolNum: Number assigned to Protocol for farming
   */
  function collectRewards(uint256 _farmProtocolNum) external returns (bytes memory claimedToken) {
    if (_farmProtocolNum == 0) {
      _comppTLR.claimComp(msg.sender);
      //claimedToken = 0xc00e94Cb662C3520282E6f5717214004A7f26888;
    } else if (_farmProtocolNum == 1) {
      uint256 unclaimedrewards = _aaVeLM.getUserUnclaimedRewards(msg.sender);
      console.log("who is msg.sender", msg.sender);
      console.log("unclaimedrewards", unclaimedrewards);

      bytes memory data = abi.encodeWithSignature(
        "claimRewards(address[] calldata,uint256,address)",
        aaveClaimAddrs,
        unclaimedrewards,
        msg.sender
      );
      bytes memory claimedToken = _execute(address(_aaVeLM), data);

      // uint256 number = _aaVeLM.claimRewards(aaveClaimAddrs, unclaimedrewards, msg.sender);
      //console.log('returned value ClainRewards', response);
      //claimedToken = 0x4da27a545c0c5B758a6BA100e3a049001de870f5;
    } else {
      //claimedToken = 0x0000000000000000000000000000000000000000;
    }
  }

  /**
   * @dev Returns byte response of delegatcalls
   */
  function _execute(address _target, bytes memory _data) internal returns (bytes memory response) {
    /* solhint-disable */
    assembly {
      let succeeded := delegatecall(sub(gas(), 5000), _target, add(_data, 0x20), mload(_data), 0, 0)
      let size := returndatasize()

      response := mload(0x40)
      mstore(0x40, add(response, and(add(add(size, 0x20), 0x1f), not(0x1f))))
      mstore(response, size)
      returndatacopy(add(response, 0x20), 0, size)

      switch iszero(succeeded)
      case 1 {
        // throw if delegatecall failed
        revert(add(response, 0x20), size)
      }
    }
    /* solhint-disable */
  }
}
