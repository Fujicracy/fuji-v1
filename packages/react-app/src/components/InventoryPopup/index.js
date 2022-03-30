import React, { useState, useRef, useEffect } from 'react';
import { Flex } from 'rebass';

import { NFT_GAME_MODAL_THEMES } from 'consts';

import SectionTitle from '../Blocks/SectionTitle';
import { BlackButton, CountButton, Label } from '../UI';
import { StyledModal, OpacityImage, CloseButton, IntroPanel, PanelContainer } from './styles';

const InventoryPopup = ({
  isOpen,
  onSubmit,
  inventory,
  onClose,
  description = 'Meter Points',
  isRedeemed = false,
  isLoading = false,
  onEndOpeningAnimation,
}) => {
  const [opacity, setOpacity] = useState(0);
  const [amount, setAmount] = useState(inventory.amount);
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef && animationRef.current) {
      if (isLoading) animationRef.current.play();
      else animationRef.current.pause();
    }
  }, [isLoading]);

  function afterOpen() {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }

  function beforeClose() {
    return new Promise(resolve => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });
  }

  const theme = NFT_GAME_MODAL_THEMES[inventory.type];
  return (
    <StyledModal
      color={theme.foreColor}
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      backgroundColor={theme.backColor}
      opacity={opacity}
      padding={isRedeemed ? '0rem' : '2rem'}
    >
      {isRedeemed ? (
        <IntroPanel width="100%" height="100%" autoPlay muted onEnded={onEndOpeningAnimation}>
          <source src={theme.openingAnimation} />
        </IntroPanel>
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
            </SectionTitle>
            <SectionTitle
              color={theme.foreColor}
              fontSize="20px"
              mt="12px"
              spanColor={theme.foreColor}
              spanFontSize="14px"
              alignItems="baseline"
            >
              {(amount * inventory.price).toLocaleString()} <span>{description}</span>
            </SectionTitle>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <PanelContainer backgroundColor={theme.backColor} />
              <IntroPanel autoPlay={isLoading} muted loop ref={animationRef}>
                <source src={theme.pendingAnimation} />
              </IntroPanel>
            </Flex>
          </Flex>

          <Flex flexDirection="row" justifyContent="center" alignItems="center" sx={{ zIndex: 5 }}>
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
            <Label color={theme.foreColor} ml={1} mr={1} width={20}>
              {amount}
            </Label>
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

          <BlackButton
            mt="16px"
            onClick={() => (isRedeemed ? onClose() : onSubmit(inventory.type, amount))}
            disabled={isLoading}
          >
            {isRedeemed ? 'Go to your inventory' : isLoading ? 'Redeeming' : 'Redeem'}
          </BlackButton>
        </>
      )}
    </StyledModal>
  );
};

export default InventoryPopup;