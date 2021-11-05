Service scripts for:
  - refinance operations
  - liquidations
  - save borrowers in csv file
  - save repayers in csv file

1. Rename `packages/bots/.sample.config.json` to `packages/bots/.sample.json` and set values of desired networks
  - set one of `infuraId` and `providerUrl`
  - set either `privateKey` or (`relayerApiSecret` and `relayerApiKey`)

2. Run a bot for core markets in Ethereum
```
node main.js [refinance|liquidate|borrowers|repayers]
# or for more options
node main.js help
```
