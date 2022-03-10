import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { giftBoxImage } from 'assets/images';
import { SectionTitle } from '../Blocks';
import { Label, CountButton } from '../UI';
import { Container, ItemPanel, BuyButton } from './styles';

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

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const backColor = type === INVENTORY_TYPE.COMMON ? 'white' : '#735CDD';
  const buttonColor =
    type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';

  const isBuyButtonDisabled = isBuying || amount === 0 || isLoading;

  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const disabledForeColor = type === INVENTORY_TYPE.COMMON ? 'gray' : 'rgb(255, 255, 255, 0.5)';

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
  return (
    <Container backgroundColor={backColor} color={foreColor} mode="general">
      <SectionTitle color={foreColor} fontSize="20px" fontWeight="bold">
        {title}
      </SectionTitle>
      <SectionTitle
        color={foreColor}
        fontSize={isMobile ? '14px' : '16px'}
        mt={2}
        spanFontSize="10px"
        spanColor={foreColor}
        lineHeight="12px"
        alignItems="baseline"
      >
        {points.toLocaleString()} <span>{description}</span>
      </SectionTitle>

      <ItemPanel src={giftBoxImage} />
      <Flex
        mt={isMobile ? '10px' : '16px'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <CountButton
            backgroundColor={buttonColor}
            onClick={() => {
              if (!isBuying && amount >= 1) setAmount(amount - 1);
            }}
            disabled={isBuyButtonDisabled}
            foreColor={isBuying ? disabledForeColor : foreColor}
            activeColor={backColor}
          >
            -
          </CountButton>
          <Label color={foreColor} ml={1} mr={1} width={20}>
            {amount}
          </Label>
          <CountButton
            backgroundColor={buttonColor}
            onClick={() => !isBuying && setAmount(amount + 1)}
            disabled={isBuying || isLoading}
            foreColor={isBuying ? disabledForeColor : foreColor}
            activeColor={backColor}
          >
            +
          </CountButton>
        </Flex>
        <BuyButton
          mt={isMobile ? '12px' : '16px'}
          backgroundColor={buttonColor}
          foreColor={isBuyButtonDisabled ? disabledForeColor : foreColor}
          activeColor={backColor}
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
    </Container>
  );
};

export default GeneralItem;
