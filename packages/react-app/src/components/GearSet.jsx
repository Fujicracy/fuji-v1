import React from 'react';
import { Flex, Image } from 'rebass';
import { IntenseSpan } from 'components/UI';
import { SectionTitle } from 'components/Blocks';
import { fujiMedia } from 'consts';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: ${props => props.width || '229px'};
  height: ${props => props.width || '229px'};

  ${fujiMedia.lessThan('small')`
    width: ${props => props.width || '160px'};
    height: ${props => props.width || '160px'};
  `}
`;

const Item = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  width: ${props => props.width || '229px'};
  height: ${props => props.width || '229px'};
  ${fujiMedia.lessThan('small')`
    width: ${props => props.width || '160px'};
    height: ${props => props.width || '160px'};
  `}
  background: rgb(18, 18, 18);

  border: 2px solid rgb(58, 58, 58);
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(
    circle 20px at calc(100% - 15px) 15px,
    transparent 20px,
    purple 0
  );

  transition: 0.3s all;
  ${props =>
    props.hover &&
    `&:hover {
      border: 2px solid #fa266c;
      cursor: pointer;
      & > div {
        // rewrite for GearSetBadge
        background-color: #fa266c;
    }`}
  }
`;

const Badge = styled.div`
  width: 43px;
  height: 43px;

  transition: all 0.3s;
  background-color: rgb(58, 58, 58);
  border-radius: 50%;
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 1;
`;

const Number = styled.div`
  width: 43px;
  height: 43px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  color: rgba(240, 1, 79, 1);
  position: absolute;
  right: -8px;
  top: 4px;
  z-index: 2;
`;

const GearSet = ({ nftGear, width, textColor, hover = true }) => {
  const { balance, images, name, boost } = nftGear;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Container width={width}>
        <Item width={width} hover={hover}>
          <Badge />
          <Image src={images.medium} width={width} />
        </Item>
        <Number>
          <Flex justifyContent="center" alignItems="center">
            <IntenseSpan fontSize="22px">{balance}</IntenseSpan>
          </Flex>
        </Number>
      </Container>
      <SectionTitle
        color={textColor}
        spanColor={textColor === 'black' ? textColor : '#05FF00'}
        mt={2}
      >
        {name}
        <span>+{boost}%</span>
      </SectionTitle>
    </Flex>
  );
};

export default GearSet;
