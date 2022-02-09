import React from 'react';
import { Flex } from 'rebass';

import { SectionTitle } from '../Blocks';
import { Container, ItemPanel, BuyButton, CountButton } from './styles';

const NftItemPanel = ({ type = 'common', title, points, description }) => {
  const themeColor =
    type === 'common' ? 'rgba(0, 194, 255, 1)' : type === 'epic' ? '#FF0000' : '#000000';
  return (
    <Container themeColor={themeColor} type={type}>
      <SectionTitle color={themeColor} fontSize="20px" fontWeight="bold">
        {title}
      </SectionTitle>
      <SectionTitle mt={2}>{points.toLocaleString()}</SectionTitle>
      <SectionTitle mt={2}>{description}</SectionTitle>
      <ItemPanel mt={3} />
      <Flex mt={3} flexDirection="column" alignItems="center" justifyContent="center">
        <Flex flexDirection="row">
          <CountButton>+</CountButton>
          <SectionTitle ml={1} mr={1}>
            0
          </SectionTitle>
          <CountButton>-</CountButton>
        </Flex>
        <BuyButton mt={3}>Buy</BuyButton>
      </Flex>
    </Container>
  );
};

export default NftItemPanel;
