/* eslint-disable no-unused-vars */
import React from 'react';
import { INVENTORY_TYPE } from 'consts';
import { commonMask, epicMask, legendaryMask } from 'assets/images';
// import { Flex } from 'rebass';

import { Container, OpacityImage, MarkContainer, FujiMark } from './styles';

const InventoryItem = ({ type = INVENTORY_TYPE.COMMON, onClick }) => {
  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  // const buttonColor =
  //   type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';
  const mask =
    type === INVENTORY_TYPE.EPIC
      ? epicMask
      : type === INVENTORY_TYPE.LEGENDARY
      ? legendaryMask
      : commonMask;

  return (
    <Container
      backgroundColor={backColor}
      color={foreColor}
      mode="inventory"
      padding="18px"
      onClick={onClick}
    >
      <MarkContainer type={type} />
      <OpacityImage src={mask} />
      <FujiMark type={type} right>
        FujiDao - Climbing
      </FujiMark>
      <FujiMark type={type} left>
        FujiDao - Climbing
      </FujiMark>
    </Container>
  );
};

export default InventoryItem;
