import React from 'react';
import { INVENTORY_TYPE } from 'consts';

const ItemInfos = ({ type }) => {
  switch (type) {
    case INVENTORY_TYPE.COMMON:
      return (
        <>
          <p>Probabilities for Common:</p>
          <ul>
            <li>4.99% Gear NFT</li>
            <li>45.01% Booster Score</li>
            <li>50% Empty</li>
          </ul>
        </>
      );
    case INVENTORY_TYPE.EPIC:
      return (
        <>
          <p>Probabilities for Epic:</p>
          <ul>
            <li>4.99% Gear NFT</li>
            <li>45.01% Booster Score</li>
            <li>50% Empty</li>
          </ul>
        </>
      );
    case INVENTORY_TYPE.LEGENDARY:
      return <>Not implemented</>;
    default:
      return <></>;
  }
};

export default ItemInfos;
