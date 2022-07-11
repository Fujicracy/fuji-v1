# Service scripts for:
  - refinance operations
  - liquidations
  - save borrowers in csv file
  - save repayers in csv file

## How to run a script

1. Rename `packages/bots/.sample.config.json` to `packages/bots/.sample.json` and set values of desired networks
  - set one of `infuraId` and `providerUrl`
  - set either `privateKey` or (`relayerApiSecret` and `relayerApiKey`)
  - IMPORTANT: `networkName` corresponds to [NAME] below 

2. Run a bot
  - for core markets in Ethereum (default)
```
node main.js [refinance|liquidate|borrowers|repayers]
# or for more options
node main.js help
```
  - for core markets in another network
```
node main.js [refinance|liquidate|borrowers|repayers] -- network [NAME]
# or for more options
node main.js help
```

## How to setup scripts for a new network

1. Prerequisite: Deployment of the contracts and creation of the corresponding deploy file in `packages/hardhat/artifacts`
  When new contracts get deployed, there should be a file in artifacts folder having the form `[ID]-core.deploy`.

2. Publish contracts details to other packages of the repo
  - `cd packages/hardhat`
  - `yarn publish:core --network [NAME]` where `NAME` is the name of the network, defined in `packages/hardhat/hardhat.config.js`

  This creates two files:
  - `packages/react-app/src/contracts/[ID]-core.deployment.json`
  - `packages/bots/contracts/[ID]-core.deployment.json`

3. PROVIDERS
  - Create a file in `packages/bots/consts/providers-[NAME]-core.js` with all providers for the given network by using as a template one of the already existing files.
  - Make sure the property `name` of each provider **matches exactly the name of the deployed provider's contract**.
  - Export globally the new values from `packages/bots/consts/providers.js`.

4. ASSETS
  - Create a file in `packages/bots/consts/assets-[NAME].js` with all assets for the given network by using as a template one of the already existing files.
  - Add the new values to `ASSETS` and `ASSET_NAME` from `packages/bots/consts/assets.js` to export them.

5. VAULTS
  - Create a file in `packages/bots/consts/vaults-[NAME]-core.js` with all vaults for the given network by using as a template one of the already existing files. Do not forget to change the import paths for the providers and the assets.
  - Make sure the property `name` of each vault **matches exactly the name of the deployed vault's contract**.
  - Export globally the new values from `packages/bots/consts/vaults.js`.
