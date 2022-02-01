// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract ProofReader {
  bytes32 public merkleRoot;
  uint8 storeddataSize;

  mapping(address => bool) public givePoints;

  constructor(bytes32 _merkleroot) {
    merkleRoot = _merkleroot;
  }

  function tryGetthePoints() public {
    (bool successGetProof, bytes32[] memory proof) = _getProofFromMessage();
    require(successGetProof, "Cannot extract proof!");
    require(_verify(msg.sender, proof), "cannot verify proof!");
    givePoints[msg.sender] = true;
  }

  function _verify(address userAddress, bytes32[] memory proof) internal view returns (bool) {
    bytes32 leaf = keccak256(abi.encodePacked(userAddress));
    return MerkleProof.verify(proof, merkleRoot, leaf);
  }

  function _getProofFromMessage() internal returns (bool success, bytes32[] memory proof) {
    uint8 dataSize; //Number of data entries
    assembly {
      dataSize := calldatasize()
    }
    storeddataSize = dataSize;
    console.log("dataSize", storeddataSize);
  }
}
