import React, { useState } from 'react';
import { Flex } from 'rebass';
import { commonMask, epicMask, legendaryMask } from 'assets/images';
import { INVENTORY_TYPE } from 'consts';

import SectionTitle from '../Blocks/SectionTitle';
import { BlackButton } from '../UI';
import { StyledModal, OpacityImage, ItemPanel, CloseButton } from './styles';

const InventoryPopup = ({
  isOpen,
  onRedeem,
  title,
  points,
  onClose,
  type = INVENTORY_TYPE.COMMON,
  description = 'Meter Points',
  isRedeemed = false,
}) => {
  const [opacity, setOpacity] = useState(0);

  function afterOpen() {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }

  function beforeClose() {
    return new Promise(resolve => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });
  }

  const themeColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';

  const backMask =
    type === INVENTORY_TYPE.COMMON
      ? commonMask
      : INVENTORY_TYPE.EPIC === 'epic'
      ? epicMask
      : legendaryMask;

  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  return (
    <StyledModal
      color={themeColor}
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      backgroundColor={backColor}
      opacity={opacity}
    >
      <OpacityImage src={backMask} height="100%" />
      <CloseButton onClick={() => onClose()} />
      <SectionTitle color={themeColor} fontSize="20px" fontWeight="bold">
        Crates Opening
      </SectionTitle>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <SectionTitle color={themeColor} fontSize="32px" fontWeight="bold" mt="48px">
          {title}
        </SectionTitle>
        <SectionTitle
          color={themeColor}
          fontSize="20px"
          mt="24px"
          spanColor={themeColor}
          spanFontSize="14px"
          alignItems="baseline"
        >
          {points.toLocaleString()} <span>{description}</span>
        </SectionTitle>
        <ItemPanel />
      </Flex>
      {isRedeemed ? (
        <BlackButton mt="24px" onClick={onClose}>
          Go to your inventory
        </BlackButton>
      ) : (
        <BlackButton mt="24px" onClick={onRedeem}>
          Redeem
        </BlackButton>
      )}
    </StyledModal>
  );
};

export default InventoryPopup;
