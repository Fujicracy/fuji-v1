import React from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { SectionTitle } from '../Blocks';
import { Label } from '../UI';
import { Container, ItemPanel, BuyButton, CountButton } from './styles';

const GeneralItem = ({ type = INVENTORY_TYPE.COMMON, title, points, description }) => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const buttonColor =
    type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';
  return (
    <Container backgroundColor={backColor} color={foreColor} mode="general">
      <SectionTitle lineHeight="18px" color={foreColor} fontSize="20px" fontWeight="bold">
        {title}
      </SectionTitle>
      <SectionTitle
        color={foreColor}
        fontSize={isMobile ? '14px' : '16px'}
        mt={2}
        spanFontSize="10px"
        spanColor={foreColor}
        lineHeight="12px"
        alignItems="baseline"
      >
        {points.toLocaleString()} <span>{description}</span>
      </SectionTitle>

      <ItemPanel mt={isMobile ? '8px' : '16px'} />
      <Flex
        mt={isMobile ? '10px' : '16px'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <CountButton backgroundColor={buttonColor}>-</CountButton>
          <Label color={foreColor} ml={1} mr={1}>
            0
          </Label>
          <CountButton backgroundColor={buttonColor}>+</CountButton>
        </Flex>
        <BuyButton mt={isMobile ? '12px' : '16px'} backgroundColor={buttonColor}>
          Buy
        </BuyButton>
      </Flex>
    </Container>
  );
};

export default GeneralItem;
