import React, { useState, useRef, useEffect } from 'react';
import { Flex } from 'rebass';
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
  RedeemButton,
} from './styles';

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
  const [amount, setAmount] = useState(inventory.amount);
  const [showInfo, setShowInfo] = useState(false);
  const animationRef = useRef(null);

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
              {showInfo ? (
                <CancelIcon
                  onClick={() => setShowInfo(!showInfo)}
                  style={{ zIndex: 1, cursor: 'pointer' }}
                />
              ) : (
                <InfoIcon
                  onClick={() => setShowInfo(!showInfo)}
                  style={{ zIndex: 1, cursor: 'pointer' }}
                />
              )}
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

              <RedeemButton
                mt="16px"
                onClick={() => (isRedeemed ? onClose() : onSubmit(inventory.type, amount))}
                disabled={isLoading}
              >
                {isRedeemed ? 'Go to your inventory' : isLoading ? 'Redeeming' : 'Redeem'}
              </RedeemButton>
            </>
          )}
        </>
      )}
    </StyledModal>
  );
};

export default InventoryPopup;
