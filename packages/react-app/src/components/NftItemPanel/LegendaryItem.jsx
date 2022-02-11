import React from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { SectionTitle } from '../Blocks';
import {
  Container,
  ItemPanel,
  BuyButton,
  CountButton,
  LegendaryItemsContainter,
  LegendarySection,
} from './styles';

const LegendaryItem = ({ type = 'common', title, points, description }) => {
  const themeColor = '#000000';
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <Container themeColor={themeColor} type={type}>
      <LegendaryItemsContainter>
        <SectionTitle color={themeColor} fontSize="20px" fontWeight="bold">
          {title}
        </SectionTitle>
        <LegendarySection color={themeColor}>{points.toLocaleString()}</LegendarySection>
        <LegendarySection color={themeColor}>{description}</LegendarySection>
      </LegendaryItemsContainter>

      <ItemPanel mt={3} />
      <LegendaryItemsContainter
        position="right"
        margin={isMobile ? '0px 0px 0px 16px' : '16px 0px 0px'}
      >
        <Flex flexDirection="row">
          <CountButton>+</CountButton>
          <SectionTitle ml={1} mr={1} color={themeColor}>
            0
          </SectionTitle>
          <CountButton>-</CountButton>
        </Flex>
        <BuyButton margin={isMobile ? '0px 0px 0px 16px' : '16px 0px 0px'}>Buy</BuyButton>
      </LegendaryItemsContainter>
    </Container>
  );
};

export default LegendaryItem;
