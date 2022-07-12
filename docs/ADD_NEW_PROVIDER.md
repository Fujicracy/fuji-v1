# Add a new provider

## 1. Deploy contract
Deployment of the contract and creation of the corresponding deploy file in `packages/hardhat/artifacts`.

When the new contract gets deployed, there should be a change in the file `[ID]-core.deploy` in artifacts folder.
One have to see there the address and the ABI of the new provider.

## 2. Publish contract
Publish contracts details to other packages of the repo.
```
cd packages/hardhat
yarn publish:core --network [NAME]
```


This creates two files:

- `packages/react-app/src/contracts/[ID]-core.deployment.json`
- `packages/bots/contracts/[ID]-core.deployment.json`

## 3. Front-end
- Add a new `PROVIDER_TYPE` and a new entry in `PROVIDERS` in `packages/react-app/src/consts/providers.js`.

- Make sure the property `name` of the provider **matches exactly the name of the deployed provider's contract**.

- Add the newly created provider to the list of providers for affected vaults in `packages/react-app/src/consts/vaults-[NAME].js`

## 4. Bots
- Add a new entry in `packages/bots/consts/providers-[NAME]-core.js`.

- Make sure the property `name` of the provider **matches exactly the name of the deployed provider's contract**.


---
_* `[ID]` is the id of the network, 1 for ethereum mainnet, 250 for fantom, etc._

_* `[NAME]` is the name of the network, as defined in `packages/hardhat/hardhat.config.js`_
