// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../../abstracts/claimable/Claimable.sol";
import "../../interfaces/IFujiAdmin.sol";
import "../../interfaces/IVault.sol";
import "../../interfaces/IFlasher.sol";
import "../../interfaces/IFliquidator.sol";
import "../../interfaces/IFujiMappings.sol";
import "../../interfaces/IWETH.sol";
import "../libraries/LibUniversalERC20FTM.sol";
import "../../libraries/FlashLoans.sol";
import "../../libraries/Errors.sol";
import "../../interfaces/aave/IFlashLoanReceiver.sol";
import "../../interfaces/aave/IAaveLendingPool.sol";

contract FlasherFTM is IFlasher, Claimable, IFlashLoanReceiver {
  using LibUniversalERC20FTM for IERC20;

  IFujiAdmin private _fujiAdmin;

  address private constant _FTM = 0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF;
  address private constant _WFTM = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;

  address private immutable _geistLendingPool = 0x9FAD24f572045c7869117160A571B2e50b10d068;

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
  function initiateFlashloan(FlashLoan.Info calldata info, uint8 _flashnum) external isAuthorized override {
    if (_flashnum == 0) {
      _initiateGeistFlashLoan(info);
    }
  }

  /**
   * @dev Initiates an Geist flashloan.
   * @param info: data to be passed between functions executing flashloan logic
   */
  function _initiateGeistFlashLoan(FlashLoan.Info calldata info) internal {
    //Initialize Instance of Geist Lending Pool
    IAaveLendingPool geistLp = IAaveLendingPool(_geistLendingPool);

    //Passing arguments to construct Geist flashloan -limited to 1 asset type for now.
    address receiverAddress = address(this);
    address[] memory assets = new address[](1);
    assets[0] = address(info.asset == _FTM ? _WFTM : info.asset);
    uint256[] memory amounts = new uint256[](1);
    amounts[0] = info.amount;

    // 0 = no debt, 1 = stable, 2 = variable
    uint256[] memory modes = new uint256[](1);
    //modes[0] = 0;

    //address onBehalfOf = address(this);
    //bytes memory params = abi.encode(info);
    //uint16 referralCode = 0;

    //Geist Flashloan initiated.
    geistLp.flashLoan(receiverAddress, assets, amounts, modes, address(this), abi.encode(info), 0);
  }

  /**
   * @dev Executes Geist Flashloan, this operation is required
   * and called by Geistflashloan when sending loaned amount
   */
  function executeOperation(
    address[] calldata assets,
    uint256[] calldata amounts,
    uint256[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external override returns (bool) {
    require(msg.sender == _geistLendingPool && initiator == address(this), Errors.VL_NOT_AUTHORIZED);

    FlashLoan.Info memory info = abi.decode(params, (FlashLoan.Info));

    uint256 _value;
    if (info.asset == _FTM) {
      // Convert WETH to ETH and assign amount to be set as msg.value
      _convertWethToEth(amounts[0]);
      _value = info.amount;
    } else {
      // Transfer to Vault the flashloan Amount
      // _value is 0
      IERC20(assets[0]).univTransfer(payable(info.vault), amounts[0]);
    }

    _executeAction(info, amounts[0], premiums[0], _value);

    //Approve geistLP to spend to repay flashloan
    _approveBeforeRepay(info.asset == _FTM, assets[0], amounts[0] + premiums[0], _geistLendingPool);

    return true;
  }

  // ========================================================
  //
  // flash loans come here....
  //
  // ========================================================

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
    bool _isFTM,
    address _asset,
    uint256 _amount,
    address _spender
  ) internal {
    if (_isFTM) {
      _convertEthToWeth(_amount);
      IERC20(_WFTM).univApprove(payable(_spender), _amount);
    } else {
      IERC20(_asset).univApprove(payable(_spender), _amount);
    }
  }

  function _convertEthToWeth(uint256 _amount) internal {
    IWETH(_WFTM).deposit{ value: _amount }();
  }

  function _convertWethToEth(uint256 _amount) internal {
    IWETH token = IWETH(_WFTM);
    token.withdraw(_amount);
  }
}