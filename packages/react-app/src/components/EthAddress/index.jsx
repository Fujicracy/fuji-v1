import React from 'react';
import PropTypes from 'prop-types';

const EthAddress = ({ address, suffix, prefix }) => {
  if (!address) {
    return <></>;
  }
  return (
    <>
      {address.substr(0, prefix)}...{address.substr(-suffix, suffix)}
    </>
  );
};

EthAddress.propTypes = {
  address: PropTypes.string.isRequired,
  prefix: PropTypes.number,
  suffix: PropTypes.number,
};

EthAddress.defaultProps = {
  suffix: 4,
  prefix: 6,
};

export default EthAddress;
