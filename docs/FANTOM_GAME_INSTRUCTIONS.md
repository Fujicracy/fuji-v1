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

3. Install ganache-cli
```bash
npm i -g ganache-cli
```

## Run

1. Fork Fantom network from project's directory:
```
cd fuji
ganache-cli --fork https://still-patient-feather.fantom.quiknode.pro/b32ce427764a8772e89084c10441bf6e0ad4ec0f/ --chainId 31337

```

2. Deploy contracts from "hardhat" directory and publish them to other packages:
```
yarn workspace @fuji/hardhat run deploy:fantom:game
yarn workspace @fuji/hardhat publish:core
```

3. Start front-end
```
yarn start
```
