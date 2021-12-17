// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../../abstracts/claimable/Claimable.sol";
import "../../interfaces/IFujiAdmin.sol";
import "../../interfaces/IVault.sol";
import "../../interfaces/IFlasher.sol";
import "../../interfaces/IFliquidator.sol";
import "../../interfaces/IWETH.sol";
import "../../libraries/FlashLoans.sol";
import "../../libraries/Errors.sol";
import "../../interfaces/aave/IFlashLoanReceiver.sol";
import "../../interfaces/aave/IAaveLendingPool.sol";
import "../libraries/LibUniversalERC20MATIC.sol";

/**
 * @dev Contract that handles Fuji protocol flash loan logic and
 * the specific logic of all active flash loan providers used by Fuji protocol.
 */

contract FlasherMATIC is IFlasher, Claimable, IFlashLoanReceiver {
  using LibUniversalERC20MATIC for IERC20;

  IFujiAdmin private _fujiAdmin;

  address private constant _MATIC = 0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF;
  address private constant _WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

  address private immutable _aaveLendingPool = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;

  // need to be payable because of the conversion ETH <> WETH
  receive() external payable {}

  /**
   * @dev Throws if caller is not 'owner'.
   */
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
   * Emits a {FujiAdminChanged} event.
   */
  function setFujiAdmin(address _newFujiAdmin) public onlyOwner {
    _fujiAdmin = IFujiAdmin(_newFujiAdmin);
    emit FujiAdminChanged(_newFujiAdmin);
  }

  /**
   * @dev Routing Function for Flashloan Provider
   * @param info: struct information for flashLoan
   * @param _flashnum: integer identifier of flashloan provider
   */
  function initiateFlashloan(FlashLoan.Info calldata info, uint8 _flashnum)
    external
    override
    isAuthorized
  {
    if (_flashnum == 0) {
      _initiateGeistFlashLoan(info);
    } else {
      revert(Errors.VL_INVALID_FLASH_NUMBER);
    }
  }

  /**
   * @dev Initiates an Geist flashloan.
   * @param info: data to be passed between functions executing flashloan logic
   */
  function _initiateGeistFlashLoan(FlashLoan.Info calldata info) internal {
    //Initialize Instance of Geist Lending Pool
    IAaveLendingPool geistLp = IAaveLendingPool(_aaveLendingPool);

    //Passing arguments to construct Geist flashloan -limited to 1 asset type for now.
    address receiverAddress = address(this);
    address[] memory assets = new address[](1);
    assets[0] = address(info.asset == _MATIC ? _WMATIC : info.asset);
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
    require(msg.sender == _aaveLendingPool && initiator == address(this), Errors.VL_NOT_AUTHORIZED);

    FlashLoan.Info memory info = abi.decode(params, (FlashLoan.Info));

    uint256 _value;
    if (info.asset == _MATIC) {
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
    _approveBeforeRepay(
      info.asset == _MATIC,
      assets[0],
      amounts[0] + premiums[0],
      _aaveLendingPool
    );

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
    bool _isMATIC,
    address _asset,
    uint256 _amount,
    address _spender
  ) internal {
    if (_isMATIC) {
      _convertEthToWeth(_amount);
      IERC20(_WMATIC).univApprove(payable(_spender), _amount);
    } else {
      IERC20(_asset).univApprove(payable(_spender), _amount);
    }
  }

  function _convertEthToWeth(uint256 _amount) internal {
    IWETH(_WMATIC).deposit{ value: _amount }();
  }

  function _convertWethToEth(uint256 _amount) internal {
    IWETH token = IWETH(_WMATIC);
    token.withdraw(_amount);
  }
}