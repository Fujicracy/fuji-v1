// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../abstracts/claimable/Claimable.sol";
import "../interfaces/IFujiAdmin.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IFliquidator.sol";
import "../interfaces/IFujiMappings.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/cream/ICTokenFlashloan.sol";
import "../interfaces/cream/ICFlashloanReceiver.sol";
import "../libraries/LibUniversalERC20.sol";
import "../libraries/FlashLoans.sol";
import "../libraries/Errors.sol";

import "hardhat/console.sol";

contract FlasherFTM is ICFlashloanReceiver, Claimable {
  using LibUniversalERC20 for IERC20;

  IFujiAdmin private _fujiAdmin;

  address private constant _ETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
  address private constant _WETH = 0x74b23882a30290451A17c44f4F05243b6b58C76d;

  IFujiMappings private immutable _crMappings =
    IFujiMappings(0x1eEdE44b91750933C96d2125b6757C4F89e63E20);

  // need to be payable because of the conversion ETH <> WETH
  receive() external payable {}

  modifier isAuthorized() {
    require(
      msg.sender == _fujiAdmin.getController() ||
        msg.sender == _fujiAdmin.getFliquidator() ||
        msg.sender == owner(),
      Errors.VL_NOT_AUTHORIZED
    );
    _;
  }

  /**
   * @dev Sets the fujiAdmin Address
   * @param _newFujiAdmin: FujiAdmin Contract Address
   */
  function setFujiAdmin(address _newFujiAdmin) public onlyOwner {
    _fujiAdmin = IFujiAdmin(_newFujiAdmin);
  }

  /**
   * @dev Routing Function for Flashloan Provider
   * @param info: struct information for flashLoan
   * @param _flashnum: integer identifier of flashloan provider
   */
  function initiateFlashloan(FlashLoan.Info calldata info, uint8 _flashnum) external isAuthorized {
    if (_flashnum == 0) {
      _initiateCreamFlashLoan(info);
    }
  }

  // ===================== CreamFinance FlashLoan ===================================

  /**
   * @dev Initiates an CreamFinance flashloan.
   * @param info: data to be passed between functions executing flashloan logic
   */
  function _initiateCreamFlashLoan(FlashLoan.Info calldata info) internal {
    // Get crToken Address for Flashloan Call
    // from IronBank because ETH on Cream cannot perform a flashloan
    console.log("info.asset = ", info.asset);
    console.log("_ETH = ", _ETH);
    address crToken = info.asset == _ETH
      ? 0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393
      : _crMappings.addressMapping(info.asset);

    console.log("crToken = ", crToken);

    // Prepara data for flashloan execution
    bytes memory params = abi.encode(info);

    // Initialize Instance of Cream crLendingContract
    ICTokenFlashloan(crToken).flashLoan(address(this), address(this), info.amount, params);
  }

  /**
   * @dev Executes CreamFinance Flashloan, this operation is required
   * and called by CreamFinanceflashloan when sending loaned amount
   */
  function onFlashLoan(
    address sender,
    address underlying,
    uint256 amount,
    uint256 fee,
    bytes calldata params
  ) external override returns (bytes32) {
    // Check Msg. Sender is crToken Lending Contract
    // from IronBank because ETH on Cream cannot perform a flashloan
    address crToken = underlying == _WETH
      ? 0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393
      : _crMappings.addressMapping(underlying);

    require(msg.sender == crToken && address(this) == sender, Errors.VL_NOT_AUTHORIZED);
    require(IERC20(underlying).balanceOf(address(this)) >= amount, Errors.VL_FLASHLOAN_FAILED);

    FlashLoan.Info memory info = abi.decode(params, (FlashLoan.Info));

    uint256 _value;
    if (info.asset == _ETH) {
      // Convert WETH to _ETH and assign amount to be set as msg.value
      _convertWethToEth(amount);
      _value = amount;
    } else {
      // Transfer to Vault the flashloan Amount
      // _value is 0
      IERC20(underlying).univTransfer(payable(info.vault), amount);
    }

    // Do task according to CallType
    _executeAction(info, amount, fee, _value);

    if (info.asset == _ETH) _convertEthToWeth(amount + fee);
    // Approve flashloan + fee back to crToken Lending Contract
    IERC20(underlying).univApprove(payable(crToken), amount + fee);

    return keccak256("ERC3156FlashBorrowerInterface.onFlashLoan");
  }

  function _executeAction(
    FlashLoan.Info memory _info,
    uint256 _amount,
    uint256 _fee,
    uint256 _value
  ) internal {
    if (_info.callType == FlashLoan.CallType.Switch) {
      IVault(_info.vault).executeSwitch{ value: _value }(_info.newProvider, _amount, _fee);
    } else if (_info.callType == FlashLoan.CallType.Close) {
      IFliquidator(_info.fliquidator).executeFlashClose{ value: _value }(
        _info.userAddrs[0],
        _info.vault,
        _amount,
        _fee
      );
    } else {
      IFliquidator(_info.fliquidator).executeFlashBatchLiquidation{ value: _value }(
        _info.userAddrs,
        _info.userBalances,
        _info.userliquidator,
        _info.vault,
        _amount,
        _fee
      );
    }
  }

  function _approveBeforeRepay(
    bool _isETH,
    address _asset,
    uint256 _amount,
    address _spender
  ) internal {
    if (_isETH) {
      _convertEthToWeth(_amount);
      IERC20(_WETH).univApprove(payable(_spender), _amount);
    } else {
      IERC20(_asset).univApprove(payable(_spender), _amount);
    }
  }

  function _convertEthToWeth(uint256 _amount) internal {
    IWETH(_WETH).deposit{ value: _amount }();
  }

  function _convertWethToEth(uint256 _amount) internal {
    IWETH token = IWETH(_WETH);
    token.withdraw(_amount);
  }
}
