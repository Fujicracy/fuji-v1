import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'hooks';

const EthAddress = ({ address, suffix, prefix, withEns }) => {
  const { provider } = useAuth();
  const [ens, setEns] = useState(null);
  const formattedAddress = `${address.substr(0, prefix)}...${address.substr(-suffix, suffix)}`;

  useMemo(() => {
    if (address && provider && withEns) {
      resolveEns();
    }

    async function resolveEns() {
      try {
        const name = await provider.lookupAddress(address);
        setEns(name);
      } catch (e) {
        console.error(e);
      }
    }
  }, [address, provider, withEns, setEns]);

  if (!address) {
    return <></>;
  }
  return ens ? <span title={address}>{ens}</span> : <>{formattedAddress}</>;
};

EthAddress.propTypes = {
  address: PropTypes.string,
  prefix: PropTypes.number,
  suffix: PropTypes.number,
  withEns: PropTypes.bool,
};

EthAddress.defaultProps = {
  suffix: 4,
  prefix: 6,
  withEns: false,
};

export default EthAddress;
