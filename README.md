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
> `packages/hardhat/artifacts` will be created and contracts abis and addresses will be copied to `packages/hardhat/react-app/scr/contracts`

```
# in another terminal window
cd fuji
yarn deploy
```

3. Run react front-end
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
