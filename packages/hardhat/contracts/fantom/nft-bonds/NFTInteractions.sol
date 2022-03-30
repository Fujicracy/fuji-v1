// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @title NFT Interactions
/// @author fuji-dao.eth

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./NFTGame.sol";
import "../libraries/LibPseudoRandom.sol";
import "../../libraries/Errors.sol";
import "./FujiPriceAware.sol";
import "../../interfaces/chainlink/AggregatorV3Interface.sol";

contract NFTInteractions is FujiPriceAware, Initializable {
  using LibPseudoRandom for uint256;

  /**
   * @dev Reward for opening a crate, 'tokenId' corresponds to ERC1155 ids
   */
  struct Reward {
    uint256 tokenId;
    uint256 amount;
  }

  /**
   * @dev Changing a crate points price
   */
  event CratePriceChanged(uint256 crateId, uint256 price);

  /**
   * @dev Changing a card boost
   */
  event CardBoostChanged(uint256 cardId, uint256 boost);

  /**
   * @dev Changing crate rewards
   */
  event CrateRewardsChanged(uint256 crateId, uint256[] rewards);

  /**
   * @dev Acquired crates
   */
  event CratesAcquired(uint256 crateId, uint256 amount);

  /**
   * @dev Opened crates
   */
  event CratesOpened(address user, uint256 crateId, Reward[] rewards);

  /**
   * @dev Final score locked
   */
  event LockedScore(address indexed user, uint256 lockedNFTId);

  uint256 public constant CRATE_COMMON_ID = 1;
  uint256 public constant CRATE_EPIC_ID = 2;
  uint256 public constant CRATE_LEGENDARY_ID = 3;
  uint256 public constant NFT_CARD_ID_START = 4;
  bool public isRedstoneOracleOn;

  // CrateID => crate rewards
  mapping(uint256 => uint256[]) private _crateRewards;

  uint256[] private _probabilityIntervals;

  NFTGame public nftGame;

  // CrateID => crate price
  mapping(uint256 => uint256) public cratePrices;

  // CardID => boost: where boost is a base 100 number.
  mapping(uint256 => uint256) public cardBoost;

  function initialize(address _nftGame) external initializer {
    isRedstoneOracleOn = true;
    maxDelay = 5 * 60;
    nftGame = NFTGame(_nftGame);
    _probabilityIntervals = [500000, 700000, 900000, 950000, 950100];

    // Set basic cardBoost
    uint256 cardsLimit = nftGame.nftCardsAmount() + NFT_CARD_ID_START;
    for (uint256 index = NFT_CARD_ID_START; index < cardsLimit; index++) {
      cardBoost[index] = 110;
    }
  }

  // Admin functions

  /**
   * @notice Set address for NFTGame contract
   */
  function setNFTGame(address _nftGame) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    nftGame = NFTGame(_nftGame);
  }

  /**
   * @notice sets the prices for the crates
   */
  function setCratePrice(uint256 crateId, uint256 price) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    require(
      crateId == CRATE_COMMON_ID || crateId == CRATE_EPIC_ID || crateId == CRATE_LEGENDARY_ID,
      "Invalid crate ID!"
    );
    cratePrices[crateId] = price;
    emit CratePriceChanged(crateId, price);
  }

  /**
   * @notice sets probability intervals for crate rewards
   */
  function setProbabilityIntervals(uint256[] memory intervals) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    _probabilityIntervals = intervals;
  }

  /**
   * @notice sets crate rewards
   * rewards are an array, with each element corresponding to the points multiplier value
   */
  function setCrateRewards(uint256 crateId, uint256[] memory rewards) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    _crateRewards[crateId] = rewards;
    emit CrateRewardsChanged(crateId, rewards);
  }

  /**
   * @notice sets card boost rewards
   * @dev boost is a base 100 number. In example, boost = 115, 15% boost. 1.15 for computation.
   */
  function setCardBoost(uint256 cardId, uint256 boost) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    require(boost >= 100, "Boost not > 100!");
    cardBoost[cardId] = boost;
    emit CardBoostChanged(cardId, boost);
  }

  /**
   * @notice sets allowed signer address of entropy feed.
   * Admin function required by redstone-evm-connector (oracle).
   */
  function authorizeSignerEntropyFeed(address _trustedSigner) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    _authorizeSigner(_trustedSigner);
  }

  /**
   * @notice sets max allowed delay between front-end call and entropy feed.
   * Admin function required by redstone-evm-connector (oracle).
   */
  function setMaxEntropyDelay(uint256 _maxDelay) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    _setMaxDelay(_maxDelay);
  }

  /**
   * @notice Toggle between oracles for entropy.
   * switch(1) = redstone, switch(0) = chainlink
   */
  function setIsRedstoneOracleOn(bool switch_) external {
    require(nftGame.hasRole(nftGame.GAME_ADMIN(), msg.sender), Errors.VL_NOT_AUTHORIZED);
    isRedstoneOracleOn = switch_;
  }

  /// Interaction Functions

  /**
   * @notice Burns user points to mint a new crate
   */
  function mintCrates(uint256 crateId, uint256 amount) external {
    // accumulation and trading only
    uint256 phase = nftGame.getPhase();
    require(phase > 0 && phase < 3, "Wrong game phase!");
    require(!_isLocked(msg.sender), "User already locked!");

    require(
      crateId == CRATE_COMMON_ID || crateId == CRATE_EPIC_ID || crateId == CRATE_LEGENDARY_ID,
      "Invalid crate ID!"
    );

    uint256 price = cratePrices[crateId] * amount;
    require(price > 0, "Price not set");
    require(nftGame.balanceOf(msg.sender, nftGame.POINTS_ID()) >= price, "Not enough points!");

    nftGame.burn(msg.sender, nftGame.POINTS_ID(), price);

    nftGame.mint(msg.sender, crateId, amount);

    emit CratesAcquired(crateId, amount);
  }

  /**
   * @notice opens crates with the given id
   */
  function openCrate(uint256 crateId, uint256 amount) external {
    // accumulation and trading only
    uint256 phase = nftGame.getPhase();
    require(phase > 0 && phase < 3, "Wrong game phase!");
    require(!_isLocked(msg.sender), "User already locked!");

    require(
      crateId == CRATE_COMMON_ID || crateId == CRATE_EPIC_ID || crateId == CRATE_LEGENDARY_ID,
      "Invalid crate ID!"
    );
    require(nftGame.balanceOf(msg.sender, crateId) >= amount, "Not enough crates!");
    require(_crateRewards[crateId].length == _probabilityIntervals.length, "Rewards not set!");

    // Points + Crates + Cards
    Reward[] memory rewards = new Reward[](amount);
    uint256[] memory aggregatedRewards = new uint256[](1 + 3 + nftGame.nftCardsAmount());

    uint256 entropyValue = isRedstoneOracleOn ? _getRedstoneEntropy() : _getChainlinkEntropy();
    uint256[] memory randomNumbers = LibPseudoRandom.pickRandomNumbers(amount, entropyValue);
    bool isCard;

    // iterate all crates to open
    for (uint256 j = 0; j < amount; j++) {
      isCard = true;
      // iterate propability intervals to see the reward for a specific crate
      for (uint256 i = 0; i < _probabilityIntervals.length && isCard; i++) {
        if (randomNumbers[j] <= _probabilityIntervals[i]) {
          isCard = false;
          aggregatedRewards[nftGame.POINTS_ID()] += _crateRewards[crateId][i];
          rewards[j].amount = _crateRewards[crateId][i];
        }
      }

      // if the reward is a card determine the card id
      if (isCard) {
        uint256 step = 1000000 / nftGame.nftCardsAmount();
        uint256 randomNum = LibPseudoRandom.pickRandomNumbers(1, entropyValue + j)[0];
        uint256 randomId = NFT_CARD_ID_START;
        for (uint256 i = step; i <= randomNum; i += step) {
          randomId++;
        }
        aggregatedRewards[randomId]++;
        rewards[j].tokenId = randomId;
        rewards[j].amount = 1;
      }
    }

    // mint points
    if (aggregatedRewards[nftGame.POINTS_ID()] > 0) {
      nftGame.mint(msg.sender, nftGame.POINTS_ID(), aggregatedRewards[nftGame.POINTS_ID()]);
    }

    // mint cards
    uint256 cardsLimit = nftGame.nftCardsAmount() + NFT_CARD_ID_START;
    for (uint256 i = NFT_CARD_ID_START; i < cardsLimit; i++) {
      if (aggregatedRewards[i] > 0) {
        nftGame.mint(msg.sender, i, aggregatedRewards[i]);
      }
    }

    // burn opened crates
    nftGame.burn(msg.sender, crateId, amount);

    emit CratesOpened(msg.sender, crateId, rewards);
  }

  function lockFinalScore() external {
    // trading-phase only
    uint256 phase = nftGame.getPhase();
    require(phase >= 2, "Wrong game phase!");
    uint256 boostNumber = computeBoost(msg.sender);
    uint256 lockedNFTId = nftGame.userLock(msg.sender, boostNumber);

    // Emit locking event
    LockedScore(msg.sender, lockedNFTId);
  }

  /// Read-only functions

  /**
   * @notice Returns the probability intervals
   */
  function getProbabilityIntervals() external view returns (uint256[] memory) {
    return _probabilityIntervals;
  }

  /**
   * @notice Returns the rewards for a specific crate
   */
  function getCrateRewards(uint256 crateId) external view returns (uint256[] memory) {
    return _crateRewards[crateId];
  }

  /**
   * @notice Returns the totalBoost of user according to cards in possesion.
   * @dev Value is 100 based. In example; 150 is +50% or 1.5 in decimal
   */
  function computeBoost(address user) public view returns (uint256 totalBoost) {
    totalBoost = 100;
    for (
      uint256 index = NFT_CARD_ID_START;
      index < NFT_CARD_ID_START + nftGame.nftCardsAmount();
      index++
    ) {
      if (nftGame.balanceOf(user, index) > 0) {
        totalBoost += cardBoost[index];
      }
    }
  }

  /// Internal functions

  /**
   * @notice returns true if user is already locked.
   */
  function _isLocked(address user) internal view returns (bool locked) {
    (, , , , uint256 lockedID) = nftGame.userdata(user);
    if (lockedID != 0) {
      locked = true;
    }
  }

  /**
   * @notice calls redstone-oracle for entropy value.
   */
  function _getRedstoneEntropy() private view returns (uint256) {
    return _getPriceFromMsg(bytes32("ENTROPY"));
  }

  /**
   * @notice calls chainlink-oracle for entropy value.
   */
  function _getChainlinkEntropy() private view returns (uint256) {
    // Hardcoded for fantom
    (, int256 numA, , , ) = AggregatorV3Interface(0xf4766552D15AE4d256Ad41B6cf2933482B0680dc)
      .latestRoundData();
    (, int256 numB, , , ) = AggregatorV3Interface(0x11DdD3d147E5b83D01cee7070027092397d63658)
      .latestRoundData();
    return uint256(numA * numB);
  }
}