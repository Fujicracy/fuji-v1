// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

interface INFTBond {
  function isValidVault(address vault) external view returns (bool);
  function checkStateOfPoints(address user, uint256 balanceChange, bool isPayback, uint256 decimals) external;
}
