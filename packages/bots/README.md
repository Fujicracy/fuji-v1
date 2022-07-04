# Service scripts for:
  - refinance operations
  - liquidations
  - save borrowers in csv file
  - save repayers in csv file

## How to run a script

1. Rename `packages/bots/.sample.config.json` to `packages/bots/.sample.json` and set values of desired networks
  - set one of `infuraId` and `providerUrl`
  - set either `privateKey` or (`relayerApiSecret` and `relayerApiKey`)

2. Run a bot for core markets in Ethereum
```
node main.js [refinance|liquidate|borrowers|repayers]
# or for more options
node main.js help
```
## How to setup scripts for a new chain

1. Prerequisite: Deployment of the contracts and creation of the corresponding deploy file in `packages/hardhat/artifacts`
  When new contracts get deployed, there should be a file in artifacts folder having the form `[ID]-core.deploy`.

2. Publish contracts details to other packages of the repo
  - `cd packages/hardhat`
  - `yarn publish:core --network [NAME]` where `NAME` is the name of the chain, defined in `packages/hardhat/hardhat.config.js`

  This creates two files:
  - `packages/react-app/src/contracts/[ID]-core.deployment.json`
  - `packages/bots/contracts/[ID]-core.deployment.json`
