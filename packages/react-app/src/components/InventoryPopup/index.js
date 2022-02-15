/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Image, Flex } from 'rebass';
import Cookies from 'js-cookie';
import { flaskIcon, closeIcon, commonMask, epicMask, legendaryMask } from 'assets/images';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';

import SectionTitle from '../Blocks/SectionTitle';
import { Label, BlackButton, CheckBox, NavTextLink } from '../UI';
import { StyledModal, ContentContainer, OpacityImage, ItemPanel, CloseButton } from './styles';

const InventoryPopup = ({
  isOpen,
  onSubmit,
  title,
  points,
  onClose,
  type = INVENTORY_TYPE.COMMON,
}) => {
  const [opacity, setOpacity] = useState(0);
  const [checked, setChecked] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  function toggleModal() {
    setOpacity(0);
    onSubmit(checked);
    Cookies.set('confirm_disclaim', checked);
  }

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

  const handleCheckboxChange = event => {
    setChecked(event.target.checked);
  };

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
        <SectionTitle color={themeColor} fontSize="20px" mt="24px">
          {points.toLocaleString()}
        </SectionTitle>
        <ItemPanel />
      </Flex>
      <BlackButton mt="24px">Redeem</BlackButton>
    </StyledModal>
  );
};

export default InventoryPopup;
