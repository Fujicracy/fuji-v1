import React from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { SectionTitle } from '../Blocks';
import {
  ItemPanel,
  BuyButton,
  CountButton,
  LegendaryItemsContainter,
  LegendaryContainer,
} from './styles';

const LegendaryItem = ({ points, description }) => {
  const themeColor = 'white';
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <LegendaryContainer color={themeColor} backgroundColor="#A5243D">
      <LegendaryItemsContainter>
        <SectionTitle color={themeColor} fontSize="20px" fontWeight="bold">
          Legendary
        </SectionTitle>
        <SectionTitle
          color={themeColor}
          fontSize="16px"
          mt={2}
          spanFontSize="10px"
          spanColor={themeColor}
        >
          {points.toLocaleString()} <span>{description}</span>
        </SectionTitle>
      </LegendaryItemsContainter>

      <ItemPanel mode={INVENTORY_TYPE.LEGENDARY} />
      <LegendaryItemsContainter
        position="right"
        margin={isMobile ? '0px 0px 0px 16px' : '16px 0px 0px'}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="center" width="100%">
          <CountButton>-</CountButton>
          <SectionTitle ml={1} mr={1} color={themeColor}>
            0
          </SectionTitle>
          <CountButton>+</CountButton>
          {isMobile && (
            <BuyButton block margin="0px 0px 0px 16px" width="70%">
              Buy
            </BuyButton>
          )}
        </Flex>
        {!isMobile && <BuyButton margin="16px 0px 0px">Buy</BuyButton>}
      </LegendaryItemsContainter>
    </LegendaryContainer>
  );
};

export default LegendaryItem;
