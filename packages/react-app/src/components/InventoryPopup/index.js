import React, { useState } from 'react';
import { Flex } from 'rebass';
import { commonMaskImage, epicMaskImage, legendaryMaskImage } from 'assets/images';
import { INVENTORY_TYPE } from 'consts';

import SectionTitle from '../Blocks/SectionTitle';
import { BlackButton } from '../UI';
import { StyledModal, OpacityImage, ItemPanel, CloseButton } from './styles';

const InventoryPopup = ({
  isOpen,
  onSubmit,
  title,
  points,
  onClose,
  type = INVENTORY_TYPE.COMMON,
  description = 'Meter Points',
  isRedeemed = false,
  isLoading = false,
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
      ? commonMaskImage
      : INVENTORY_TYPE.EPIC === 'epic'
      ? epicMaskImage
      : legendaryMaskImage;

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
      <CloseButton onClick={isLoading ? undefined : onClose} />
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

      <BlackButton
        mt="24px"
        onClick={() => (isRedeemed ? onClose() : onSubmit(type))}
        disabled={isLoading}
      >
        {isRedeemed ? 'Go to your inventory' : isLoading ? 'Redeeming' : 'Redeem'}
      </BlackButton>
    </StyledModal>
  );
};

export default InventoryPopup;
