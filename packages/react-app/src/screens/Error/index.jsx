import React, { useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { CHAINS, BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { useAuth } from 'hooks';

import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';

import { notFoundIcon } from 'assets/images';
import { Button } from 'components';
import { ErrorContainer, Title, ErrorImage, ErrorBrand, ErrorText } from './styles';

function Error() {
  const history = useHistory();
  const { errorType } = useParams();
  const location = useLocation();

  const { address, connectAccount, networkId } = useAuth();
  const { from } = location.state || { from: { pathname: '/dashboard' } };

  // const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

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
    <Flex justifyContent="center" alignItems="center" width="100%">
      <ErrorContainer>
        {errorType === 'not-connected' ? (
          <>
            <Title>
              <ErrorBrand>You are not connected</ErrorBrand>
              <ErrorText>&gt; Please, connect your wallet!</ErrorText>
            </Title>
            <Button
              onClick={() => {
                return connectAccount();
              }}
            >
              Connect wallet
            </Button>
          </>
        ) : errorType === 'wrong-network' ? (
          <>
            <Title>
              <ErrorBrand>Unsupported network</ErrorBrand>
              <ErrorText>&gt; Please, switch to an appropriate one!</ErrorText>
            </Title>
          </>
        ) : (
          <>
            <ErrorImage src={notFoundIcon} />
            <Title>
              <ErrorBrand>Are you lost?</ErrorBrand>
              <ErrorText>&gt; Nothing was found at this URL</ErrorText>
            </Title>
            <Button
              width={256}
              height={isTablet ? 56 : 40}
              fontSize={isTablet ? '24px' : '16px'}
              onClick={() => {
                window.location = '/';
              }}
            >
              Go back Home
            </Button>
          </>
        )}
      </ErrorContainer>
    </Flex>
  );
}

export default Error;
