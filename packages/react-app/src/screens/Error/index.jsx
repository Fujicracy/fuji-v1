import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import { NETWORK, CHAIN_ID } from '../../constants';
import { useAuth } from '../../hooks';

import './styles.css';

function Error() {
  const history = useHistory();
  const { errorType } = useParams();
  const location = useLocation();

  const { address, loadWeb3Modal } = useAuth();
  const { from } = location.state || { from: { pathname: '/dashboard' } };

  const [chainId, setChainId] = useState(Number(window.ethereum ? window.ethereum.chainId : null));

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('chainChanged', chainID => {
        setChainId(Number(chainID));
      });
    }
  }, [chainId]);

  useEffect(() => {
    if (errorType === 'wrong-network') {
      if (chainId === Number(CHAIN_ID)) {
        history.replace(from);
        history.go(0);
      }
    }
  }, [errorType, chainId, history, from]);

  useEffect(() => {
    if (errorType === 'not-connected') {
      if (address && address.startsWith('0x')) {
        history.replace(from);
      }
    }
  }, [errorType, address, history, from]);

  return (
    <div className="error-page">
      {errorType === 'wrong-network' ? (
        <h1 className="error-title">
          <span className="brand-color">You are on the wrong network</span>
          <span className="text-color">
            `{'>'}` Please, switch to {NETWORK}
          </span>
        </h1>
      ) : errorType === 'not-connected' ? (
        <>
          <h1 className="error-title">
            <span className="brand-color">You are not connected</span>
            <span className="text-color">`{'>'}` Please, connect your wallet!</span>
          </h1>
          <Button
            className="main-button"
            onClick={() => {
              return loadWeb3Modal();
            }}
          >
            Connect wallet
          </Button>
        </>
      ) : (
        <>
          <img alt="not-found-404" src="/not-found-404.svg" />
          <h1 className="error-title">
            <span className="brand-color">Are you lost?</span>
            <span className="text-color">`{'>'}` Nothing was found at this URL</span>
          </h1>
          <Button className="main-button" href="/">
            Go back Home
          </Button>
        </>
      )}
    </div>
  );
}

export default Error;
