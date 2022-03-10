import React, { useState } from 'react';
import { Flex } from 'rebass';
import { commonMaskImage, epicMaskImage, legendaryMaskImage } from 'assets/images';
import { INVENTORY_TYPE } from 'consts';

import SectionTitle from '../Blocks/SectionTitle';
import { BlackButton, CountButton, Label } from '../UI';
import { StyledModal, OpacityImage, ItemPanel, CloseButton } from './styles';

const InventoryPopup = ({
  isOpen,
  onSubmit,
  inventory,
  onClose,
  description = 'Meter Points',
  isRedeemed = false,
  isLoading = false,
}) => {
  const [opacity, setOpacity] = useState(0);
  const [amount, setAmount] = useState(inventory.amount);

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

  const themeColor = inventory.type === INVENTORY_TYPE.COMMON ? 'black' : 'white';

  const backMask =
    inventory.type === INVENTORY_TYPE.COMMON
      ? commonMaskImage
      : inventory.type === INVENTORY_TYPE.EPIC
      ? epicMaskImage
      : legendaryMaskImage;

  const backColor =
    inventory.type === INVENTORY_TYPE.COMMON
      ? 'white'
      : inventory.type === INVENTORY_TYPE.EPIC
      ? '#735CDD'
      : '#A5243D';

  const countButtonColor =
    inventory.type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';
  const foreColor = inventory.type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const disabledForeColor =
    inventory.type === INVENTORY_TYPE.COMMON ? 'gray' : 'rgb(255, 255, 255, 0.5)';

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
        <SectionTitle color={themeColor} fontSize="32px" fontWeight="bold" mt="24px">
          {inventory.type}
        </SectionTitle>
        <SectionTitle
          color={themeColor}
          fontSize="20px"
          mt="12px"
          spanColor={themeColor}
          spanFontSize="14px"
          alignItems="baseline"
        >
          {(amount * inventory.price).toLocaleString()} <span>{description}</span>
        </SectionTitle>
        <ItemPanel mt="16px" />
      </Flex>

      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        mt="16px"
        sx={{ zIndex: 5 }}
      >
        <Label color={foreColor} ml={1} mr={1}>
          Open
        </Label>
        <CountButton
          backgroundColor={countButtonColor}
          onClick={() => {
            if (!isLoading && amount >= 2) setAmount(amount - 1);
          }}
          disabled={isLoading || amount === 1}
          foreColor={isLoading ? disabledForeColor : foreColor}
          activeColor={backColor}
        >
          -
        </CountButton>
        <Label color={foreColor} ml={1} mr={1} width={20}>
          {amount}
        </Label>
        <CountButton
          backgroundColor={countButtonColor}
          onClick={() => !isLoading && amount < inventory.amount && setAmount(amount + 1)}
          disabled={isLoading || amount >= inventory.amount}
          foreColor={isLoading ? disabledForeColor : foreColor}
          activeColor={backColor}
        >
          +
        </CountButton>
        <Label color={foreColor} ml={1} mr={1}>
          {amount > 1 ? 'Crates' : 'Crate'}
        </Label>
      </Flex>

      <BlackButton
        mt="16px"
        onClick={() => (isRedeemed ? onClose() : onSubmit(inventory.type, amount))}
        disabled={isLoading}
      >
        {isRedeemed ? 'Go to your inventory' : isLoading ? 'Redeeming' : 'Redeem'}
      </BlackButton>
    </StyledModal>
  );
};

export default InventoryPopup;
