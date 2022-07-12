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
