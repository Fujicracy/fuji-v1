import React, { useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { CHAINS } from 'consts';
import { useAuth } from 'hooks';

import { notFoundIcon } from 'assets/images';

import './styles.css';

function Error() {
  const history = useHistory();
  const { errorType } = useParams();
  const location = useLocation();

  const { address, connectAccount, networkId } = useAuth();
  const { from } = location.state || { from: { pathname: '/dashboard' } };

  useEffect(() => {
    if (errorType === 'not-connected') {
      if (address && address.startsWith('0x')) {
        history.replace(from);
      }
    }
  }, [errorType, address, history, from]);

  useEffect(() => {
    if (errorType === 'wrong-network') {
      const network = Object.values(CHAINS).find(v => v.id === networkId && v.isDeployed);
      if (network) {
        history.replace('/dashboard');
      }
    }
  }, [errorType, networkId, history]);

  return (
    <div className="error-page">
      {errorType === 'not-connected' ? (
        <>
          <h1 className="error-title">
            <span className="brand-color">You are not connected</span>
            <span className="text-color">&gt; Please, connect your wallet!</span>
          </h1>
          <Button
            className="main-button"
            onClick={() => {
              return connectAccount();
            }}
          >
            Connect wallet
          </Button>
        </>
      ) : errorType === 'wrong-network' ? (
        <>
          <h1 className="error-title">
            <span className="brand-color">Unsupported network</span>
            <span className="text-color">&gt; Please, switch to an appropriate one!</span>
          </h1>
        </>
      ) : (
        <>
          <img alt="not-found-404" src={notFoundIcon} />
          <h1 className="error-title">
            <span className="brand-color">Are you lost?</span>
            <span className="text-color">&gt; Nothing was found at this URL</span>
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
