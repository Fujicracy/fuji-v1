import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useRouteMatch, Link, NavLink } from "react-router-dom";
import {
  useContractLoader,
  useExternalContractLoader,
  useContractReader,
  useAuth,
} from "../../hooks";
import { DAI_ADDRESS, DAI_ABI, USDC_ADDRESS, USDC_ABI } from "../../constants";
import { getCollateralId } from "../../helpers";

import MyPositions from "./MyPositions";
import ManagePosition from "./ManagePosition";
import InitBorrow from "./InitBorrow";
import Simulation from "./Simulation";
import Error from "../Error";
import Loader from "../../components/Loader";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

function Dashboard() {
  const { path } = useRouteMatch();
  const { address, provider, loadWeb3Modal, logoutOfWeb3Modal } = useAuth();

  const [logout, setLogout] = useState(false);
  const [loader, setLoader] = useState(true);

  const contracts = useContractLoader(provider)
  const DAIContract = useExternalContractLoader(provider, DAI_ADDRESS, DAI_ABI);
  const USDCContract = useExternalContractLoader(provider, USDC_ADDRESS, USDC_ABI);
  if (contracts) {
    contracts.DAI = DAIContract;
    contracts.USDC = USDCContract;
  }

  const collateralBalanceDai = useContractReader(
    contracts,
    "FujiERC1155",
    "balanceOf",
    [address, getCollateralId("DAI")]
  );

  const collateralBalanceUsdc = useContractReader(
    contracts,
    "FujiERC1155",
    "balanceOf",
    [address, getCollateralId("USDC")]
  );

  useEffect(() => {
    setTimeout(() => setLoader(false), 2000);
  }, []);

  const header = () => (
    <header>
      <Link to="/" className="logo">
        <img alt="logo" src="/logo-title.svg" />
      </Link>

      <nav>
        <ul>{
          address
            ? (
              <>
                <li className="nav-item">
                  <NavLink to="/dashboard/init-borrow" activeClassName="current">
                    Borrow
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/dashboard/my-positions" activeClassName="current">
                    My positions
                  </NavLink>
                </li>
              </>
            )
            : ""}
          <li>
            <a
              href="/"
              onClick={() => !address ? loadWeb3Modal() : logoutOfWeb3Modal()}
              onMouseEnter={() => setLogout(true)}
              onMouseLeave={() => setLogout(false)}
              className={address ? "button-nav connected" : "button-nav"}
            >
              {!address
                ? "Connect Wallet"
                : logout
                  ? "Disconnect"
                  : address.substr(0, 6) + "..." + address.substr(-4, 4)
              }
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );

  //<li>
    //<Link to="#"><span className="material-icons">light_mode</span></Link>
  //</li>

  return (
    <>
      {header()}
        {loader
          ? <Loader />
          : (
            <>
              <Switch>
                <ProtectedRoute exact path={`${path}`}>
                  {!collateralBalanceDai || !collateralBalanceUsdc
                    ? <Loader />
                    : collateralBalanceDai.gt(0) || collateralBalanceUsdc.gt(0)
                      ? <Redirect to="/dashboard/my-positions" />
                      : <Redirect to="/dashboard/init-borrow" />
                  }
                </ProtectedRoute>
                <ProtectedRoute path={`${path}/simulation`}>
                  <Simulation
                    contracts={contracts}
                    address={address}
                  />
                </ProtectedRoute>
                <ProtectedRoute path={`${path}/init-borrow`}>
                  <InitBorrow
                    contracts={contracts}
                    provider={provider}
                    address={address}
                  />
                </ProtectedRoute>
                <ProtectedRoute path={`${path}/my-positions`}>
                  <MyPositions
                    contracts={contracts}
                    address={address}
                  />
                </ProtectedRoute>
                <ProtectedRoute path={`${path}/position`}>
                  <ManagePosition
                    contracts={contracts}
                    provider={provider}
                    address={address}
                  />
                </ProtectedRoute>
                <Route path={`${path}/:errorType`}>
                  <Error />
                </Route>
              </Switch>
            </>
          )
        }
    </>
  );
}

function ProtectedRoute({ children, ...rest }) {
  const { address } = useAuth();

  const [chainId, setChainId] = useState(
    Number(window.ethereum ? window.ethereum.chainId : null)
  );

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('chainChanged', (chainID) => {
        setChainId(Number(chainID));
      });
    }
  }, [chainId]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
          chainId !== Number(CHAIN_ID)
            ? <Redirect to="/dashboard/wrong-network" />
            : address
              ? children
              : (
                <Redirect
                  to={{
                    pathname: "/dashboard/not-connected",
                    state: { from: location }
                  }}
                />
              )
      }
    />
  );
}

export default Dashboard;
