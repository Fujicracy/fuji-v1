import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE } from 'consts';
import { giftBox } from 'assets/images';
import { SectionTitle } from '../Blocks';
import { Label } from '../UI';
import {
  ItemPanel,
  BuyButton,
  CountButton,
  LegendaryItemsContainter,
  LegendaryContainer,
} from './styles';

const LegendaryItem = ({ points, description, onBuy }) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  const themeColor = 'white';
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const isBuyButtonDisabled = isBuying || amount === 0;

  const handleClickBuy = async () => {
    if (isBuying) return;

    try {
      setIsBuying(true);
      const res = await onBuy(INVENTORY_TYPE.LEGENDARY, amount);
      if (res) setAmount(0);
    } catch (error) {
      console.error('minting inventory error:', { error });
    }
    setIsBuying(false);
  };
  return (
    <LegendaryContainer color={themeColor} backgroundColor="#A5243D">
      <LegendaryItemsContainter>
        <SectionTitle color={themeColor} fontSize="20px" fontWeight="bold">
          Legendary
        </SectionTitle>
        <SectionTitle
          color={themeColor}
          fontSize="16px"
          mt={2}
          spanFontSize="10px"
          spanColor={themeColor}
          lineHeight="12px"
          alignItems="baseline"
        >
          {points.toLocaleString()} <span>{description}</span>
        </SectionTitle>
      </LegendaryItemsContainter>

      <ItemPanel mode={INVENTORY_TYPE.LEGENDARY} src={giftBox} />
      <LegendaryItemsContainter
        position="right"
        margin={isMobile ? '0px 0px 0px 16px' : '16px 0px 0px'}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="center" width="100%">
          <CountButton
            onClick={() => {
              if (amount >= 1) setAmount(amount - 1);
            }}
            disabled={isBuying}
          >
            -
          </CountButton>
          <Label color={themeColor} ml={1} mr={1} width={20}>
            {amount}
          </Label>
          <CountButton onClick={() => setAmount(amount + 1)} disabled={isBuying}>
            +
          </CountButton>
          {isMobile && (
            <BuyButton
              block
              margin="0px 0px 0px 16px"
              width="70%"
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
          )}
        </Flex>
        {!isMobile && (
          <BuyButton margin="16px 0px 0px" disabled={isBuyButtonDisabled} onClick={handleClickBuy}>
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
        )}
      </LegendaryItemsContainter>
    </LegendaryContainer>
  );
};

export default LegendaryItem;
