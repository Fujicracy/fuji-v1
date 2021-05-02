# 🗻Fuji Finance

> Borrowing Aggregator

Fuji is a protocol that aims to optimize loan expenses for DeFi users. It achieves this by monitoring the borrowing markets and whenever there is a better rate, it automatically refinances the whole debt of its users.

---

This project was bootstraped with [scaffold-eth](https://github.com/austintgriffith/scaffold-eth). The repository makes use of [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces). Workspaces can be found in `/packages`.

## QuickStart

1. Install dependancies and run a mainnet fork
```
cd fuji
yarn install
yarn fork
```

2. Deploy contracts
- `packages/hardhat/artifacts` is created
- contracts abis and addresses are copied to `packages/react-app/src/contracts` and to `packages/bots/contracts`

```
# in another terminal window
cd fuji
yarn deploy
```

3. Front-end

3.1. Create `.env` in `packages/react-app` and set the following variables:
```
REACT_APP_INFURA_ID=
REACT_APP_CHAIN_ID=31337
```

3.2. [Configure new network](https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer) on your metamask:
- new RPC url -> http://localhost:8545
- Chain ID -> 31337

3.3. Run a development server
```
# in another terminal window
cd fuji
yarn start
```

4. _(optional)_ Run service bots
> Execute liquidations for undercollaterized positions
```
# in another terminal window
cd fuji
yarn bots:liquidate
```
