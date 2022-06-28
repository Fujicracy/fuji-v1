import React from 'react';
import { Flex, Image } from 'rebass';
import { IntenseSpan } from 'components/UI';
import { SectionTitle } from 'components/Blocks';
import {
  GearSetItem,
  GearSetNumber,
  GearSetContainer,
  GearSetBadge,
} from '../screens/NftGame/styles';

const GearSet = ({ nftGear, width, textColor }) => {
  const { balance, images, name } = nftGear;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <GearSetContainer>
        <GearSetItem>
          <GearSetBadge />
          <Image src={images.small} width={width} />
        </GearSetItem>
        <GearSetNumber>
          <Flex justifyContent="center" alignItems="center">
            <IntenseSpan fontSize="12px">x</IntenseSpan>
            <IntenseSpan fontSize="18px">{balance}</IntenseSpan>
          </Flex>
        </GearSetNumber>
      </GearSetContainer>
      <SectionTitle
        color={textColor}
        spanColor={textColor === 'black' ? textColor : '#05FF00'}
        mt={2}
      >
        {name}
      </SectionTitle>
    </Flex>
  );
};

export default GearSet;
