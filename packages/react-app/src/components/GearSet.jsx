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

const GearSet = ({ nftGear, width, textColor, hover = true }) => {
  const { balance, images, name, boost } = nftGear;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <GearSetContainer width={width}>
        <GearSetItem width={width} hover={hover}>
          <GearSetBadge />
          <Image src={images.medium} width={width} />
        </GearSetItem>
        <GearSetNumber>
          <Flex justifyContent="center" alignItems="center">
            <IntenseSpan fontSize="22px">{balance}</IntenseSpan>
          </Flex>
        </GearSetNumber>
      </GearSetContainer>
      <SectionTitle color={textColor} spanColor="#05FF00" mt={2}>
        {name}
        <span>+{boost}%</span>
      </SectionTitle>
    </Flex>
  );
};

export default GearSet;
