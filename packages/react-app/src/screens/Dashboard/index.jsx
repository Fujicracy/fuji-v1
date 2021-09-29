import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import find from 'lodash/find';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Loader, Header } from 'components';
import { BackgroundEffect } from 'components/UI';
import { useContractLoader, useContractReader, useAuth } from 'hooks';
import { COLLATERAL_IDS } from 'consts';

import Error from '../Error';

import MyPositions from './MyPositions';
import ManagePosition from './ManagePosition';
import InitBorrow from './InitBorrow';

function Dashboard() {
  const { path } = useRouteMatch();
  const { address, provider } = useAuth();

  const [loader, setLoader] = useState(true);

  const contracts = useContractLoader(provider);

  const collateralBals = useContractReader(contracts, 'FujiERC1155', 'balanceOfBatch', [
    map(Object.values(COLLATERAL_IDS), () => address),
    Object.values(COLLATERAL_IDS),
  ]);

  useEffect(() => {
    setTimeout(() => setLoader(false), 5000);
  }, []);

  return (
    <>
      <Header />
      {loader ? (
        <Loader />
      ) : (
        <Switch>
          <ProtectedRoute exact path={`${path}`}>
            {!collateralBals ? (
              <Loader />
            ) : find(collateralBals, balance => balance.gt(0)) ? (
              <Redirect to="/dashboard/my-positions" />
            ) : (
              <Redirect to="/dashboard/init-borrow" />
            )}
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/init-borrow`}>
            <InitBorrow contracts={contracts} provider={provider} address={address} />
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/my-positions`}>
            <MyPositions contracts={contracts} address={address} />
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/position`}>
            <ManagePosition contracts={contracts} provider={provider} address={address} />
          </ProtectedRoute>
          <Route path={`${path}/:errorType`}>
            <Error />
          </Route>
        </Switch>
      )}
    </>
  );
}

function ProtectedRoute({ children, ...rest }) {
  const { address } = useAuth();

  return (
    <>
      <Route
        {...rest}
        render={({ location }) =>
          address ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/dashboard/not-connected',
                state: { from: location },
              }}
            />
          )
        }
      />
      <BackgroundEffect />
    </>
  );
}

export default Dashboard;
