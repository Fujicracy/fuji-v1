module.exports = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FlashClose",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FlashLiquidate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "userAddr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Liquidate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_userAddrs",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      }
    ],
    "name": "batchLiquidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_userAddrs",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_usrsBals",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "_liquidatorAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_flashloanFee",
        "type": "uint256"
      }
    ],
    "name": "executeFlashBatchLiquidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_userAddr",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_flashloanFee",
        "type": "uint256"
      }
    ],
    "name": "executeFlashClose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_userAddrs",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_flashnum",
        "type": "uint8"
      }
    ],
    "name": "flashBatchLiquidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "_amount",
        "type": "int256"
      },
      {
        "internalType": "address",
        "name": "_vault",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_flashnum",
        "type": "uint8"
      }
    ],
    "name": "flashClose",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flashCloseF",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "a",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "b",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_newFactorA",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "_newFactorB",
        "type": "uint64"
      }
    ],
    "name": "setFlashCloseFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newFujiAdmin",
        "type": "address"
      }
    ],
    "name": "setFujiAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newSwapper",
        "type": "address"
      }
    ],
    "name": "setSwapper",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapper",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];