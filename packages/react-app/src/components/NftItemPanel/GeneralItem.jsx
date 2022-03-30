import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE, NFT_GAME_MODAL_THEMES } from 'consts';
import { SectionTitle } from '../Blocks';
import { Label, CountButton } from '../UI';
import { Container, ItemPanel, BuyButton, InfoButton, CancelButton } from './styles';
import ItemInfo from './ItemInfo';

const GeneralItem = ({
  type = INVENTORY_TYPE.COMMON,
  title,
  points,
  description,
  onBuy,
  isLoading,
}) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const isBuyButtonDisabled = isBuying || amount === 0 || isLoading;

  const theme = NFT_GAME_MODAL_THEMES[type];
  const handleClickBuy = async () => {
    if (isBuying) return;

    try {
      setIsBuying(true);
      const res = await onBuy(type, amount);
      if (res) setAmount(0);
    } catch (error) {
      console.error('minting inventory error:', { error });
    }
    setIsBuying(false);
  };

  const body = showInfo ? (
    <ItemInfo type={type} />
  ) : (
    <>
      <ItemPanel src={theme.idleImage} />
      <Flex
        mt={isMobile ? '10px' : '16px'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <CountButton
            backgroundColor={theme.buttonColor}
            onClick={() => {
              if (!isBuying && amount >= 1) setAmount(amount - 1);
            }}
            disabled={isBuyButtonDisabled}
            foreColor={isBuying ? theme.disabledForeColor : theme.foreColor}
            activeColor={theme.backColor}
          >
            -
          </CountButton>
          <Label color={theme.foreColor} ml={1} mr={1} width={20}>
            {amount}
          </Label>
          <CountButton
            backgroundColor={theme.buttonColor}
            onClick={() => !isBuying && setAmount(amount + 1)}
            disabled={isBuying || isLoading}
            foreColor={isBuying ? theme.disabledForeColor : theme.foreColor}
            activeColor={theme.backColor}
          >
            +
          </CountButton>
        </Flex>
        <BuyButton
          mt={isMobile ? '12px' : '16px'}
          backgroundColor={theme.buttonColor}
          foreColor={isBuyButtonDisabled ? theme.disabledForeColor : theme.foreColor}
          activeColor={theme.backColor}
          disabled={isBuyButtonDisabled}
          onClick={handleClickBuy}
        >
          {isBuying && (
            <CircularProgress
              style={{
                width: 20,
                height: 20,
                marginRight: '16px',
                color: 'rgba(0, 0, 0, 0.26)',
              }}
            />
          )}
          Buy
        </BuyButton>
      </Flex>
    </>
  );

  return (
    <Container backgroundColor={theme.backColor} color={theme.foreColor} mode="general">
      {showInfo ? (
        <CancelButton onClick={() => setShowInfo(false)} />
      ) : (
        <InfoButton onClick={() => !isBuying && setShowInfo(true)} />
      )}

      <SectionTitle color={theme.foreColor} fontSize="20px" fontWeight="bold">
        {title}
      </SectionTitle>
      <SectionTitle
        color={theme.foreColor}
        fontSize={isMobile ? '14px' : '16px'}
        mt={2}
        spanFontSize="10px"
        spanColor={theme.foreColor}
        lineHeight="12px"
        alignItems="baseline"
      >
        {points.toLocaleString()} <span>{description}</span>
      </SectionTitle>
      {body}
    </Container>
  );
};

export default GeneralItem;
