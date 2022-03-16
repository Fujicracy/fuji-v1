import React from 'react';
import { Flex } from 'rebass';

import { INVENTORY_TYPE, NFT_GAME_MODAL_THEMES } from 'consts';
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
  const theme = NFT_GAME_MODAL_THEMES[type];
  return (
    <Container
      backgroundColor={theme.backColor}
      color={theme.foreColor}
      mode="inventory"
      padding="18px"
    >
      <MarkContainer type={type} />
      <OpacityImage src={theme.backMask} />
      <BlackOverlay opacity={blackOverlayOpacity} />
      <ItemPanel src={theme.idleImage} width={80} height={80} />

      <FujiMark backgroundColor={theme.backColor} type={type} right>
        FujiDao - Climbing
      </FujiMark>
      <FujiMark backgroundColor={theme.backColor} type={type} left>
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
