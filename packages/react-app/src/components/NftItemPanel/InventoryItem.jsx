import React from 'react';
import { Flex } from 'rebass';

import { INVENTORY_TYPE } from 'consts';
import { commonMaskImage, epicMaskImage, legendaryMaskImage, giftBoxImage } from 'assets/images';
import Label from '../UI/Label';

import {
  Container,
  OpacityImage,
  MarkContainer,
  FujiMark,
  Badge,
  ItemPanel,
  StackedInventoryContainer,
  StackedContainer,
  BlackOverlay,
} from './styles';

export const InventoryItem = ({
  type = INVENTORY_TYPE.COMMON,
  amount = 1,
  isShowBadge = true,
  blackOverlayOpacity = 0,
  badgePosition = 'right',
}) => {
  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const mask =
    type === INVENTORY_TYPE.EPIC
      ? epicMaskImage
      : type === INVENTORY_TYPE.LEGENDARY
      ? legendaryMaskImage
      : commonMaskImage;

  return (
    <Container backgroundColor={backColor} color={foreColor} mode="inventory" padding="18px">
      <MarkContainer type={type} />
      <OpacityImage src={mask} />
      <BlackOverlay opacity={blackOverlayOpacity} />
      <ItemPanel src={giftBoxImage} width={80} height={80} />

      <FujiMark type={type} right>
        FujiDao - Climbing
      </FujiMark>
      <FujiMark type={type} left>
        FujiDao - Climbing
      </FujiMark>
      {amount > 1 && isShowBadge && (
        <Badge position={badgePosition}>
          <Flex flexDirection="row" alignItems="baseline">
            <Label fontSize="8px" color="white">
              {`x `}
            </Label>
            <Label fontSize="14px" fontWeight="bold" color="white">
              {amount}
            </Label>
          </Flex>
        </Badge>
      )}
    </Container>
  );
};

export const StackedInventoryItem = ({ type = INVENTORY_TYPE.COMMON, onClick, amount = 1 }) => {
  const cardsAmount = Math.min(amount, 3);
  return (
    <StackedContainer flexDirection="row" position="relative" onClick={onClick}>
      {Array(cardsAmount)
        .fill()
        .map((_, index) => (
          <StackedInventoryContainer
            overlay={index < cardsAmount - 1}
            // eslint-disable-next-line react/no-array-index-key
            key={`stacked-card-${type}-${index}`}
          >
            <InventoryItem
              type={type}
              amount={amount}
              isShowBadge={index === cardsAmount - 1}
              blackOverlayOpacity={(cardsAmount - index - 1) * 0.25}
            />
          </StackedInventoryContainer>
        ))}
    </StackedContainer>
  );
};
