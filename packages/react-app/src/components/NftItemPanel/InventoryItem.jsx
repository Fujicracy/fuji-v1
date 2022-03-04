import React from 'react';
import { INVENTORY_TYPE } from 'consts';
import { commonMaskImage, epicMaskImage, legendaryMaskImage } from 'assets/images';

import { Container, OpacityImage, MarkContainer, FujiMark } from './styles';

const InventoryItem = ({ type = INVENTORY_TYPE.COMMON, onClick }) => {
  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const mask =
    type === INVENTORY_TYPE.EPIC
      ? epicMaskImage
      : type === INVENTORY_TYPE.LEGENDARY
      ? legendaryMaskImage
      : commonMaskImage;

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
