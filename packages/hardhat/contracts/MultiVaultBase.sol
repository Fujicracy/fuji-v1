// SPDX-License-Identifier: MIT

pragma solidity >=0.4.25 <0.8.0;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { UniERC20 } from "./LibUniERC20.sol";

abstract contract MultiVaultBase is Ownable {

  using SafeMath for uint256;
  using UniERC20 for IERC20;

  //Approved Asset Markets in this MultiVault
  uint256 public numCollateralsAssets;
  uint256 public numBorrowAssets;
  mapping (address => bool) public collateralAssets;
  mapping (address => bool) public borrowAssets;

  //Global Balance of all collaterals in ETH
  uint256 public GlobalcollateralBalance;

  //Balance per collateral asset in native underlying
  mapping (address => uint256) balanceCollateralMarket;

  //Internal functions

  /**
  * @dev Executes deposit operation with delegatecall.
  * @param _amount: amount to be deposited
  * @param _provider: address of provider to be used
  */
  function _deposit(
    uint256 _amount,
    address _provider,
    address _collateralAsset
  ) internal {
    bytes memory data = abi.encodeWithSignature(
      "deposit(address,uint256)",
      _collateralAsset,
      _amount
    );
    _execute(_provider, data);
  }

  /**
  * @dev Executes withdraw operation with delegatecall.
  * @param _amount: amount to be withdrawn
  * @param _provider: address of provider to be used
  */
  function _withdraw(
    uint256 _amount,
    address _provider,
    address _collateralAsset
  ) internal {
    bytes memory data = abi.encodeWithSignature(
      "withdraw(address,uint256)",
      _collateralAsset,
      _amount
    );
    _execute(_provider, data);
  }

  /**
  * @dev Executes borrow operation with delegatecall.
  * @param _amount: amount to be borrowed
  * @param _provider: address of provider to be used
  */
  function _borrow(
    uint256 _amount,
    address _provider,
    address _borrowAsset
  ) internal {
    bytes memory data = abi.encodeWithSignature(
      "borrow(address,uint256)",
      _borrowAsset,
      _amount
    );
    _execute(_provider, data);
  }

  /**
  * @dev Executes payback operation with delegatecall.
  * @param _amount: amount to be paid back
  * @param _provider: address of provider to be used
  */
  function _payback(
    uint256 _amount,
    address _provider,
    address _borrowAsset
  ) internal {
    bytes memory data = abi.encodeWithSignature(
      "payback(address,uint256)",
      _borrowAsset,
      _amount
    );
    _execute(_provider, data);
  }

  /**
  * @dev Returns byte response of delegatcalls
  */
  function _execute(
    address _target,
    bytes memory _data
  ) internal returns (bytes memory response) {
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
  }
}
