# Instruction for NFT Bond Game

## Setup

1. Set in "packages/react-app/.env":

```
REACT_APP_INFURA_ID=<YOUR_KEY>
REACT_APP_DEPLOYMENT=core
REACT_APP_CHAIN_ID=31337
REACT_APP_CHAIN_NAME=fantom
```

2. Set in "packages/hardhat/.env":

```
INFURA_ID=<YOUR_KEY>
NETWORK=fantom
```

## Run

1. Fork Fantom network from project's directory:
```
cd fuji
yarn fork
```

2. Deploy contracts from "hardhat" directory and publish them to other packages:
```
cd fuji/hardhat
npx yarn deploy:fantom:game && npx yarn publish:core
```

3. Start front-end
```
cd fuji
yarn start
```
