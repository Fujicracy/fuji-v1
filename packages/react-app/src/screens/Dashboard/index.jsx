import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { DAI_ADDRESS, ERC20_ABI, USDC_ADDRESS, USDT_ADDRESS } from 'consts/addresses';
import { Loader, Header } from 'components';
import { useContractLoader, useExternalContractLoader, useContractReader, useAuth } from 'hooks';
import { getCollateralId } from 'helpers';

import Error from '../Error';

import MyPositions from './MyPositions';
import ManagePosition from './ManagePosition';
import InitBorrow from './InitBorrow';
import Simulation from './Simulation';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

function Dashboard() {
  const { path } = useRouteMatch();
  const { address, provider } = useAuth();
  const [loader, setLoader] = useState(true);

  const contracts = useContractLoader(provider);
  const DAIContract = useExternalContractLoader(provider, DAI_ADDRESS, ERC20_ABI);
  const USDCContract = useExternalContractLoader(provider, USDC_ADDRESS, ERC20_ABI);
  const USDTContract = useExternalContractLoader(provider, USDT_ADDRESS, ERC20_ABI);
  if (contracts) {
    contracts.DAI = DAIContract;
    contracts.USDC = USDCContract;
    contracts.USDT = USDTContract;
  }

  const collateralBalanceDai = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId('DAI'),
  ]);

  const collateralBalanceUsdc = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId('USDC'),
  ]);

  const collateralBalanceUsdt = useContractReader(contracts, 'FujiERC1155', 'balanceOf', [
    address,
    getCollateralId('USDT'),
  ]);

  useEffect(() => {
    if (collateralBalanceDai && collateralBalanceUsdc) setLoader(false);
  }, [collateralBalanceUsdc, collateralBalanceDai]);

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
            {!collateralBalanceDai || !collateralBalanceUsdc || !collateralBalanceUsdt ? (
              <Loader />
            ) : collateralBalanceDai.gt(0) ||
              collateralBalanceUsdc.gt(0) ||
              collateralBalanceUsdt.gt(0) ? (
              <Redirect to="/dashboard/my-positions" />
            ) : (
              <Redirect to="/dashboard/init-borrow" />
            )}
          </ProtectedRoute>
          <ProtectedRoute path={`${path}/simulation`}>
            <Simulation contracts={contracts} address={address} />
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

  const [chainId, setChainId] = useState(Number(window.ethereum ? window.ethereum.chainId : null));

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('chainChanged', chainID => {
        setChainId(Number(chainID));
      });
    }
  }, [chainId]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        chainId !== Number(CHAIN_ID) ? (
          <Redirect to="/dashboard/wrong-network" />
        ) : address ? (
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
  );
}

export default Dashboard;
