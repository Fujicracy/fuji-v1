import { INVENTORY_TYPE } from 'consts';
import React from 'react';
import { Flex } from 'rebass';

import { SectionTitle } from '../Blocks';
import { Container, ItemPanel, BuyButton, CountButton } from './styles';

const GeneralItem = ({ type = INVENTORY_TYPE.COMMON, title, points, description }) => {
  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const buttonColor =
    type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';
  return (
    <Container backgroundColor={backColor} color={foreColor} mode="general">
      <SectionTitle color={foreColor} fontSize="20px" fontWeight="bold">
        {title}
      </SectionTitle>
      <SectionTitle color={foreColor} fontSize="14px" mt={2}>
        {points.toLocaleString()}
      </SectionTitle>
      <SectionTitle color={foreColor} fontSize="14px" mt={2}>
        {description}
      </SectionTitle>
      <ItemPanel mt={3} />
      <Flex mt={3} flexDirection="column" alignItems="center" justifyContent="center">
        <Flex flexDirection="row">
          <CountButton backgroundColor={buttonColor}>+</CountButton>
          <SectionTitle color={foreColor} ml={1} mr={1}>
            0
          </SectionTitle>
          <CountButton backgroundColor={buttonColor}>-</CountButton>
        </Flex>
        <BuyButton mt={3} backgroundColor={buttonColor}>
          Buy
        </BuyButton>
      </Flex>
    </Container>
  );
};

export default GeneralItem;
