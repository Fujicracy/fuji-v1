## Add a new chain

Prerequisite: make sure contracts are deployed and functional. The contract addresses should be available in: `packages/react-app/src/contracts/[NETWORK_ID]-core.deployment.json`.

A. In `packages\react-app\src\consts` add/or modify the following files:
  1. Add a new file called: `assets-$chain`, were `$chain` is replaced by the chain name being added. Fill all the required information for that chain, and use as a reference file: `assets-ethereum.js`.
  2. Modify the `assets.js` file to include the new assets in the corresponding objects: `DEFAULT_BALANCE_ASSET`, `ASSETS`, `ASSET_NAME`.
  3. Modify the `chains.js` file to include the new chain in the corresponding objects: `CHAIN_IDS`, `CHAIN_NAMES`, `CHAINS`, and `EXPLORER_INFOS`.
  4.  Add a new file called: `vaults-$chain` , were `$chain` is replaced by the chain name being added. Fill all the required information for that chain, and use as a reference file: `vaults-core.js`.
  5. Modify the `vaults.js` file to include vault information in the corresponding objects: `BORROW_IDS`, `COLLATERAL_IDS`, `VAULTS_NAMES`, and `VAULTS`.
  6. Ensure to add all providers for the new chain following the steps for **Adding a new provider**.

B. Make the necessary changes in `packages/react-app/src/screens/Dashboard/FlashClose/index.jsx` to enable "flashClose" functionality

## Add a new provider

Prerequisite: make sure that the address and the ABI of the new provider is available in `packages/react-app/src/contracts/[NETWORK_ID]-core.deployment.json`.

1. Add a new `PROVIDER_TYPE` and a new entry in `PROVIDERS` in `packages/react-app/src/consts/providers.js`.
  - Make sure the property `name` of the provider **matches exactly the name of the deployed provider's contract**.

2. Add the newly created provider to the list of `providers` for affected vaults in `packages/react-app/src/consts/vaults-[NETWORK_NAME].js`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the React documentation on [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
