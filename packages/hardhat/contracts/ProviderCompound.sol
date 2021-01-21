// SPDX-License-Identifier: MIT

pragma solidity >=0.4.25 <0.7.5;

import "./LibUniERC20.sol";
import "./IProvider.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

interface Erc20 {
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address, uint256) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address src, address dst, uint256 amount) external returns (bool);
}

interface gencToken{
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function borrow(uint borrowAmount) external returns (uint);
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function borrowRatePerBlock() external view returns (uint);
    function balanceOfUnderlying(address owner) external returns (uint);
    function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint);
    function totalBorrowsCurrent() external returns (uint);
    function borrowBalanceCurrent(address account) external returns (uint);
    function borrowBalanceStored(address account) external view returns (uint);
    function exchangeRateStored() external view returns (uint);
    function getCash() external view returns (uint);
    function accrueInterest() external returns (uint);
    function seize(address liquidator, address borrower, uint seizeTokens) external returns (uint);
}

interface CErc20 is Erc20, gencToken {
    function mint(uint256) external returns (uint256);
    function repayBorrow(uint repayAmount) external returns (uint);
    function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint);
    function _addReserves(uint addAmount) external returns (uint);
}

interface CEth is Erc20, gencToken {
    function mint() external payable;
    function repayBorrow() external payable;
    function repayBorrowBehalf(address borrower) external payable;
}

interface Comptroller {
    function markets(address) external returns (bool, uint256);
    function enterMarkets(address[] calldata) external returns (uint256[] memory);
    function getAccountLiquidity(address) external view returns (uint256, uint256, uint256);
}

interface PriceFeed {
    function getUnderlyingPrice(address cToken) external view returns (uint);
}

contract ProviderCompound is IProvider, SafeMath {

  using SafeMath for uint256;
  using UniERC20 for IERC20;

  address payable public theVault;

  //This constructor is only for testing
  constructor(){
    theVault = msg.sender;
  }

  //This function is only for testing
  function setVaultContract(address payable _newVault) public {
    require(msg.sender == theVault, "Only current Vault can assign a newVault!");
    theVault = _newVault;
  }


  function deposit (  /*to be used as collateral*/
    bool _isETH, /*ETH deposits require a msg.value != 0 */
    address payable _DepositcTokenAddress, /*Compound cToken Address*/
    address _erc20TokenAddress, /* erc20 Token Address, used for ERC20 deposits only*/
    uint256 _tokenAmountToDeposit /*in token decimals, used for ERC20 deposits only*/
  ) external payable returns(bool) {

    if(_isETH == true) { /*Do Compound Deposit Procedure for ETH*/
      require(msg.value != 0, "Vault should provide ETH msg.value when calling function for Provider Contract to make a deposit!");

      CEth cToken = CEth(_DepositcTokenAddress); // Create a reference to the cToken contract

      cToken.mint{value:msg.value, gas:250000}(); //Compound protocol Mints cTokens

      uint numTokens = cToken.balanceOf(address(this)); //Transfer cTokens to Vault
      cToken.transfer(theVault, numTokens);
      return true;

    } else { /*Do Compound Desposit Procedure for a ERC20 Token*/

      Erc20 ERC20token = Erc20(_erc20TokenAddress); // Create reference to the ERC20 contract
      CErc20 cToken = CErc20(_DepositcTokenAddress); // Create a reference to the cToken contract

      //checks before proceeding, Vault balance, and allowance to Provider Contract
      require(ERC20token.balanceOf(msg.sender) >= _tokenAmountToDeposit, "Vault does not have enough Balance");
      require(ERC20token.allowance(theVault, address(this)) >= _tokenAmountToDeposit, "Vault needs to provide ERC20 Approval" );

      ERC20token.transferFrom(theVault, address(this),_tokenAmountToDeposit); //Transfer from Vault to Provider Contract
      ERC20token.approve(_DepositcTokenAddress, _tokenAmountToDeposit); //Provider Contract provides approval to move ERC20tokens

      uint256 numTokens = cToken.mint(_tokenAmountToDeposit);     // Compound Protocol mints cTokens
      cToken.transfer(theVault, numTokens); //Transfer cTokens to Vault
      return true;
    }
  }/*end of deposit function*/

  function withdraw ( /*remove collateral*/
    bool _isETH,
    bool redeemtype,   /*Indicate the function if amount is denominated in cTokens=true, or underlying token/ETH =false*/
    uint256 amounttoWithdraw, /*in token decimals*/
    address payable _WithdrawcTokenAddress, /*Compound cToken Address*/
    address _erc20TokenAddress /* erc20 Token Address, leave blank if not needed*/
  ) external payable returns (bool) {
    if(_isETH == true && redeemtype == true) { //Does Compound Procedure to Withdraw ETH given cToken amount
          CEth cToken = CEth(_WithdrawcTokenAddress); // Create a reference to the corresponding cToken contract

          //checks before proceeding
          require(cToken.allowance(theVault, address(this)) >= amounttoWithdraw, "Vault needs to provide cToken erc20 Approval" );

          cToken.transferFrom(theVault, address(this), amounttoWithdraw); //Send cTokens from Vault to ProviderContract
          cToken.redeem(amounttoWithdraw); //Compound Protocol Redeem Process.
          uint256 numETH = address(this).balance;
          theVault.transfer(numETH); //Send all Eth funds to theVault, this function assumes Provider contract does not have lingering ETH

          return true;

    } else if( _isETH == true && redeemtype == false) { /*Does Compound Procedure to Withdraw ETH given ETH amount*/
        CEth cToken = CEth(_WithdrawcTokenAddress); // Create a reference to the corresponding cToken contract

          uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken and Calculate amount of cToken
          uint256 cToken_amountneeded = amounttoWithdraw * exchangeRate;

          //checks before proceeding
          require(cToken.allowance(theVault, address(this)) >= cToken_amountneeded, "Vault needs to provide cToken erc20 Approval" );

          cToken.transferFrom(theVault, address(this), cToken_amountneeded); //Send cTokens from Vault to ProviderContract
          cToken.redeem(cToken_amountneeded); //Compound Protocol Redeem Process.
          uint256 numETH = address(this).balance;
          theVault.transfer(numETH); //Send all Eth funds to theVault, this function assumes Provider contract does not have lingering ETH

          return true;

    } else if ( _isETH == false && redeemtype == true) { /*Does Compound Procedure to withdraw ERC20 Token given cToken amount*/

          Erc20 ERC20token = Erc20(_erc20TokenAddress); // Create reference to the ERC20 contract that will be deposited
          CErc20 cToken = CErc20(_WithdrawcTokenAddress); // Create a reference to the corresponding cToken contract

          //checks before proceeding
          require(cToken.allowance(theVault, address(this)) >= amounttoWithdraw, "Vault needs to provide cToken erc20 Approval" );

          cToken.transferFrom(theVault, address(this), amounttoWithdraw); //Send cTokens from Vault to ProviderContract
          cToken.redeem(amounttoWithdraw); //Compound Protocol Redeem Process.
          uint256 redeemedAmount = ERC20token.balanceOf(address(this)); //get the amount of redeemed erc20token
          ERC20token.transfer(theVault, redeemedAmount); //Transfer erc20 tokens to Vault

          return true;

    } else if ( _isETH == false && redeemtype == false) { /*Does Compound Procedure to withdraw ERC20 Token given ERC20 token amount*/

          Erc20 ERC20token = Erc20(_erc20TokenAddress); // Create reference to the ERC20 contract
          CErc20 cToken = CErc20(_WithdrawcTokenAddress); // Create a reference to the corresponding cToken contract

          uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken and Calculate amount of cToken
          uint256 cToken_amountneeded = amounttoWithdraw * exchangeRate;

          //checks before proceeding
          require(cToken.allowance(theVault, address(this)) >= cToken_amountneeded, "Vault needs to provide cToken erc20 Approval" );

          cToken.transferFrom(theVault, address(this), cToken_amountneeded); //Send cTokens from Vault to ProviderContract
          cToken.redeem(cToken_amountneeded); //Compound Protocol Redeem Process.
          uint256 redeemedAmount = ERC20token.balanceOf(address(this)); //get the amount of redeemed erc20token
          ERC20token.transfer(theVault, redeemedAmount); //Transfer erc20 tokens to Vault

          return true;
        }
    }/*end of withdraw function*/

    function borrow (
      bool _isETH,
      address payable _BorrowcTokenAddress, /*Compound cToken Address*/
      address _erc20TokenAddress, /* erc20 Token Address, leave blank if borrowing eth not needed*/
      uint256 amounttoBorrow, /*in token decimals*/
      address _comptrollerAddress /*Compound Protocol Comptroller for netork*/
    ) external payable returns (bool){
      if(_isETH == true) {
        CEth cToken = CEth(_BorrowcTokenAddress); // Create a reference to the corresponding cToken contract

        uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken per underlying
        uint256 collateralfactor = getCollateralFactor(_comptrollerAddress, _BorrowcTokenAddress);
        /*vulnerability to check later*/
        uint256 cToken_amountneeded = div(mul(amounttoBorrow * exchangeRate), collateralfactor)*2;  //Calculate how many ctokens needed, + 100% avoid liquidation

        //checks before proceeding
        require(cToken.allowance(theVault, address(this)) >= cToken_amountneeded, "Vault needs to provide cToken erc20 Approval" );
        cToken.transferFrom(theVault, address(this), cToken_amountneeded); //Send cTokens from Vault to ProviderContract
        enterCollatMarket(_comptrollerAddress, _BorrowcTokenAddress); //Allow cTokens received as Collateral in Compound Protocal
        cToken.borrow(amounttoBorrow); //Compound Protocol
        theVault.transfer(amounttoBorrow); //Transfer borrowed ETH to the Vault
        return true;

      } else {
        CErc20 cToken = CErc20(_BorrowcTokenAddress); // Create a reference to the corresponding cToken contract
        Erc20 ERC20token = Erc20(_erc20TokenAddress); // Create reference to the ERC20 contract

        uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken per underlying
        uint256 collateralfactor = getCollateralFactor(_comptrollerAddress, _BorrowcTokenAddress);
        /*vulnerability to check later*/
        uint256 cToken_amountneeded = div(mul(amounttoBorrow * exchangeRate), collateralfactor)*2;  //Calculate how many ctokens needed, + 100% avoid liquidation

        //checks before proceeding
        require(cToken.allowance(theVault, address(this)) >= cToken_amountneeded, "Vault needs to provide cToken erc20 Approval" );
        cToken.transferFrom(theVault, address(this), cToken_amountneeded); //Send cTokens from Vault to ProviderContract
        enterCollatMarket(_comptrollerAddress, _BorrowcTokenAddress); //Allow cTokens received as Collateral in Compound Protocal
        cToken.borrow(amounttoBorrow); //Compound Protocol
        ERC20token.transfer(amounttoBorrow); //Transfer borrowed erc20 Tokens to the Vault
        return true;

      }
    }

    function repay(
      bool _isETH, /*ETH repay require a msg.value != 0 */
      address payable _BorrowcTokenAddress, /*Compound cToken Address*/
      address _erc20TokenAddress, /* erc20 Token Address, leave blank if borrowing eth not needed*/
      uint256 amounttoRepay, /*in token decimals for erc20, and ether=1, for ETH*/
      address _comptrollerAddress /*Compound Protocol Comptroller for netork*/
    ) external returns(bool){
      if(_isETH == true) {
        CEth cToken = CEth(_BorrowcTokenAddress); // Create a reference to the corresponding cToken contract
        cToken.repayBorrow{value:amounttoRepay}();
        exitCollatMarket(_comptrollerAddress, _BorrowcTokenAddress);

        //Return un-needed cTokens to the vault
        uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken per underlying
        uint256 collateralfactor = getCollateralFactor(_comptrollerAddress, _BorrowcTokenAddress);
        /*vulnerability to check later*/
        uint256 cToken_amountneeded = div(mul(amounttoRepay*10**18 * exchangeRate), collateralfactor);  //Calculate how many ctokens can be freed, + 100% avoid liquidation

        cToken.transfer(cToken_amountneeded); //ctokens back to the Vault

        return true;
      } else {

        Erc20 ERC20token = Erc20(_erc20TokenAddress);
        CErc20 cToken = CErc20(_BorrowcTokenAddress);

        ERC20token.approve(_erc20TokenAddress, amounttoRepay);
        cToken.repayBorrow(amounttoRepay);
        exitCollatMarket(_comptrollerAddress, _BorrowcTokenAddress);

        //Return un-needed cTokens to the vault
        uint256 exchangeRate = cToken.exchangeRateCurrent(); //Get exchange rate ctoken per underlying
        uint256 collateralfactor = getCollateralFactor(_comptrollerAddress, _BorrowcTokenAddress);
        /*vulnerability to check later*/
        uint256 cToken_amountneeded = div(mul(amounttoRepay*exchangeRate), collateralfactor);  //Calculate how many ctokens can be freed, + 100% avoid liquidation

        cToken.transfer(cToken_amountneeded); //ctokens back to the Vault

        return true;
      }

    }

    function getCollateralFactor(
      address _comptrollerAddress, /*Compound Protocol Comptroller for netork*/
      address payable _BorrowcTokenAddress /*Compound cToken Address*/
    ) internal returns(uint256) {
      Comptroller Cptrllr = Comptroller(_comptrollerAddress); // Create a reference to the corresponding network Comptroller
      (bool isListed, uint factor, bool isComped) = Cptrllr.market(_BorrowcTokenAddress); //Call comptroller for information
      return factor;
    }

    function enterCollatMarket(
      address _comptrollerAddress, /*Compound Protocol Comptroller for netork*/
      address payable _BorrowcTokenAddress /*Compound cToken Address*/
    ) internal returns(uint256) {
      Comptroller Cptrllr = Comptroller(_comptrollerAddress); // Create a reference to the corresponding network Comptroller
      Cptrllr.enterMarkets([_BorrowcTokenAddress]);
    }

    function exitCollatMarket(
      address _comptrollerAddress, /*Compound Protocol Comptroller for netork*/
      address payable _BorrowcTokenAddress /*Compound cToken Address*/
    ) internal returns(uint256) {
      Comptroller Cptrllr = Comptroller(_comptrollerAddress); // Create a reference to the corresponding network Comptroller
      Cptrllr.exitMarkets(_BorrowcTokenAddress);
    }

      /* THESE ARE TEST ONLY FUNCTIONS*/
      function manualETHwithdraw(uint amount) public payable returns(uint) {
      //check balance of msg.sender is sufficient.
      require(msg.sender == theVault, "You are not the Vault");
      theVault.transfer(amount);
      return address(this).balance;
      }

      function detroyme() public payable {
        require(msg.sender == theVault, "Only theVault can destroy this smartcontract!");
        theVault.transfer(address(this).balance);
        selfdestruct(theVault); //Send remaining ETh to theVault if any left.
      }

      function manualtransferERC20(address _erc20Address, uint amountToken) public {
        require(msg.sender == theVault, "You are not the Vault");
        Erc20 erc20Token = Erc20(_erc20Address);
        erc20Token.transfer(theVault, amountToken);
      }

      function getPrice(address _priceFeedAddress, address _ctoken_address ) public returns(uint256){
         PriceFeed pFeed = PriceFeed(_priceFeedAddress); // Create a reference to the corresponding network PriceFeedContract
         return pFeed.getUnderlyingPrice(_ctoken_address);
      }
}
/*
KOVAN COMPTROLLER: 0x5eae89dc1c671724a672ff0630122ee834098657
PRICE FEED: 0xbBdE93962Ca9fe39537eeA7380550ca6845F8db7
KOVAN COMPTROLLER MARKETS
[
0x4a77fAeE9650b09849Ff459eA1476eaB01606C7a, cBat
0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD, cDAI
0xA4eC170599a1Cf87240a35b9B1B8Ff823f448b57, cREP
0xb3f7fB482492f4220833De6D6bfCC81157214bEC, cSAI
0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72, cETH
0x4a92E71227D294F041BD82dd8f78591B75140d63, cUSDC
0x3f0A0EA2f86baE6362CF9799B523BA06647Da018, cUSDT
0xa1fAA15655B0e7b6B6470ED3d096390e6aD93Abb, cWBTC
0xAf45ae737514C8427D373D50Cd979a242eC59e5a, cZRX
]
*/
