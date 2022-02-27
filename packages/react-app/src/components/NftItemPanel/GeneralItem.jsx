import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';
import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { SectionTitle } from '../Blocks';
import { Label } from '../UI';
import { Container, ItemPanel, BuyButton, CountButton } from './styles';

const GeneralItem = ({ type = INVENTORY_TYPE.COMMON, title, points, description, onBuy }) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const backColor =
    type === INVENTORY_TYPE.COMMON ? 'white' : type === INVENTORY_TYPE.EPIC ? '#735CDD' : '#A5243D';
  const foreColor = type === INVENTORY_TYPE.COMMON ? 'black' : 'white';
  const buttonColor =
    type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.16)' : 'rgba(255, 255, 255, 0.16)';

  const isBuyButtonDisabled = isBuying || amount === 0;

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
      <SectionTitle lineHeight="18px" color={foreColor} fontSize="20px" fontWeight="bold">
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

      <ItemPanel mt={isMobile ? '8px' : '16px'} />
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
              if (amount >= 1) setAmount(amount - 1);
            }}
            disabled={isBuying}
          >
            -
          </CountButton>
          <Label color={foreColor} ml={1} mr={1} width={20}>
            {amount}
          </Label>
          <CountButton
            backgroundColor={buttonColor}
            onClick={() => setAmount(amount + 1)}
            disabled={isBuying}
          >
            +
          </CountButton>
        </Flex>
        <BuyButton
          mt={isMobile ? '12px' : '16px'}
          backgroundColor={buttonColor}
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
