import React, { useState, useRef, useEffect } from 'react';
import { Flex, Text } from 'rebass';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';

import { NFT_GAME_MODAL_THEMES } from 'consts';
import ItemInfos from 'components/NftItemPanel/ItemInfo';

import SectionTitle from '../Blocks/SectionTitle';
import { CountButton, Label } from '../UI';
import {
  StyledModal,
  CloseButton,
  OpacityImage,
  IntroPanel,
  PanelContainer,
  SkipButton,
  OpenButton,
  AmountInput,
} from './styles';

const InventoryPopup = ({
  isOpen,
  onSubmit,
  inventory,
  onClose,
  isOpened = false,
  isLoading = false,
  onEndOpeningAnimation,
}) => {
  const [amount, setAmount] = useState(inventory.amount);
  const [showInfo, setShowInfo] = useState(false);
  const animationRef = useRef(null);

  const canSkipAnimation = localStorage.getItem('nftgame.canSkip') ?? false;

  useEffect(() => {
    if (animationRef && animationRef.current) {
      if (isLoading) animationRef.current.play();
      else animationRef.current.pause();
    }
  }, [isLoading]);

  const theme = NFT_GAME_MODAL_THEMES[inventory.type];
  return (
    <StyledModal
      color={theme.foreColor}
      isOpen={isOpen}
      backgroundColor={theme.backColor}
      onEscapeKeydown={onClose}
      padding={isOpened ? '0rem' : '2rem'}
    >
      {isOpened ? (
        <>
          <IntroPanel
            width="100%"
            height="100%"
            autoPlay
            muted
            onEnded={() => {
              localStorage.setItem('nftgame.canSkip', true);
              onEndOpeningAnimation();
            }}
          >
            <source src={theme.openingAnimation} />
          </IntroPanel>
          {canSkipAnimation && (
            <SkipButton onClick={onEndOpeningAnimation}>Skip to reward...</SkipButton>
          )}
        </>
      ) : (
        <>
          <OpacityImage src={theme.backMask} height="100%" />
          <CloseButton onClick={isLoading ? undefined : onClose} />
          <SectionTitle color={theme.foreColor} fontSize="20px" fontWeight="bold">
            Crates Opening
          </SectionTitle>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <SectionTitle color={theme.foreColor} fontSize="32px" fontWeight="bold" mt="24px">
              {inventory.type}
              {showInfo ? (
                <CancelIcon
                  onClick={() => setShowInfo(!showInfo)}
                  style={{ zIndex: 1, cursor: 'pointer', marginLeft: '8px' }}
                />
              ) : (
                <InfoIcon
                  onClick={() => setShowInfo(!showInfo)}
                  style={{ zIndex: 1, cursor: 'pointer', marginLeft: '8px' }}
                />
              )}
            </SectionTitle>

            {showInfo ? (
              <ItemInfos type={inventory.type} />
            ) : (
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <PanelContainer backgroundColor={theme.backColor} />
                <IntroPanel autoPlay={isLoading} muted loop ref={animationRef}>
                  <source src={theme.pendingAnimation} />
                </IntroPanel>
              </Flex>
            )}
          </Flex>

          {!showInfo && (
            <>
              <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{ zIndex: 5 }}
              >
                <Label color={theme.foreColor} ml={1} mr={1}>
                  Open
                </Label>
                <CountButton
                  backgroundColor={theme.buttonColor}
                  onClick={() => {
                    if (!isLoading && amount >= 2) setAmount(amount - 1);
                  }}
                  disabled={isLoading || amount === 1}
                  foreColor={isLoading ? theme.disabledForeColor : theme.foreColor}
                  activeColor={theme.backColor}
                >
                  -
                </CountButton>
                <AmountInput
                  value={amount}
                  theme={theme}
                  type="number"
                  onChange={e => setAmount(parseInt(e.target.value, 10))}
                  disabled={isLoading}
                />
                <CountButton
                  backgroundColor={theme.buttonColor}
                  onClick={() => !isLoading && amount < inventory.amount && setAmount(amount + 1)}
                  disabled={isLoading || amount >= inventory.amount}
                  foreColor={isLoading ? theme.disabledForeColor : theme.foreColor}
                  activeColor={theme.backColor}
                >
                  +
                </CountButton>
                <Label color={theme.foreColor} ml={1} mr={1}>
                  {amount > 1 ? 'Crates' : 'Crate'}
                </Label>
              </Flex>

              {amount > inventory.amount && (
                <Text fontSize="1" marginTop="2" color="grey">
                  ⚠️ You does not have enough crates available in your inventory ({inventory.amount}{' '}
                  available).
                </Text>
              )}

              <OpenButton
                mt="16px"
                onClick={() => (isOpened ? onClose() : onSubmit(inventory.type, amount))}
                disabled={isLoading || amount > inventory.amount}
              >
                {isOpened ? 'Go to your inventory' : isLoading ? 'Opening' : 'Open'}
              </OpenButton>
            </>
          )}
        </>
      )}
    </StyledModal>
  );
};

export default InventoryPopup;
