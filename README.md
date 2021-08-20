# 🗻Fuji Finance

> Borrowing Aggregator

Fuji is a protocol that aims to optimize loan expenses for DeFi users. It achieves this by monitoring the borrowing markets and whenever there is a better rate, it automatically refinances the whole debt of its users.

---

This project was bootstraped with [scaffold-eth](https://github.com/austintgriffith/scaffold-eth). The repository makes use of [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces). Workspaces can be found in `/packages`.

## QuickStart

### 1. Install dependancies and run a mainnet fork
> IMPORTANT! Please set ALCHEMY_ID or INFURA_ID in "./packages/hardhat/.env"
```
cd fuji
yarn install
yarn fork
```

### 2. Get contracts
There are **2 options** to do this:

**2.1. Deploy** new contracts to your local fork (from step 1) and initialize them.

```
# in another terminal window
cd fuji
yarn deploy
```
This command:
- will create `packages/hardhat/artifacts` and will populate it with new contracts data: *abis, bytecode and addresses*
- will copy this data to other workspaces: in `packages/react-app/src/contracts` and in `packages/bots/contracts`

> This could be useful if you want to test on completely new contracts.

**2.2. Sync** abis, bytecode and addresses of already deployed on mainnet contracts.
```
# in another terminal window
cd fuji
yarn sync
```
This command:
- will sync *abis, bytecode and addresses* of contracts already deployed on mainnet to `packages/react-app/src/contracts` and to `packages/bots/contracts`

> Doing this way, you'll have the contracts with all the historical data and events, till the moment of the fork (from step 1).

### 3. Front-end

3.1. Create `.env` in `packages/react-app` and set the following variables:
```
REACT_APP_INFURA_ID=<YOUR-KEY>
REACT_APP_CHAIN_ID=31337
```

3.2. [Configure new network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer) on your metamask:
- new RPC url -> http://localhost:8545
- Chain ID -> 31337

3.3. Send some local ETH to your metamask address so that you can make transactions
```
cd fuji
yarn send --from 0 --to YOUR_ADDRESS --amount 10
```

3.4. Run a development server
```
# in another terminal window
cd fuji
yarn start
```

> ATTENTION! Please, keep in mind that if you have already done some transactions on your local fork and you restart it, you will have to reset your Metamask account (to reset the nonce and the current block number).

### 4. _(optional)_ Run service bots
> Execute liquidations for undercollaterized positions

4.1. Create `packages/bots/.env` and set the following variables:
```
ETHEREUM_PROVIDER_URL=
PRIVATE_KEY=
```
The address that is behind `PRIVATE_KEY` needs to contain some ETH in order to pay for gas. If you are running a local fork, you can send to your address some local ETH: `yarn send --from 0 --to YOUR_ADDRESS --amount 10`.

*If you don't set `ETHEREUM_PROVIDER_URL`, it will connect by default to http://localhost:8545 where is runnig you local fork.*


4.2. Run the bot
```
# in another terminal window
cd fuji
yarn bots:liquidate
```
