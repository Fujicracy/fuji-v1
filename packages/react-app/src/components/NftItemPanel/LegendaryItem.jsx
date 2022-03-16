import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES, INVENTORY_TYPE, NFT_GAME_MODAL_THEMES } from 'consts';
import { SectionTitle } from '../Blocks';
import { Label, CountButton } from '../UI';
import { ItemPanel, BuyButton, LegendaryItemsContainter, LegendaryContainer } from './styles';

const LegendaryItem = ({ points, description, onBuy, isLoading }) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const isBuyButtonDisabled = isBuying || amount === 0 || isLoading;

  const theme = NFT_GAME_MODAL_THEMES[INVENTORY_TYPE.LEGENDARY];

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
    <LegendaryContainer color={theme.foreColor} backgroundColor={theme.backColor}>
      <LegendaryItemsContainter>
        <SectionTitle color={theme.foreColor} fontSize="20px" fontWeight="bold">
          Legendary
        </SectionTitle>
        <SectionTitle
          color={theme.foreColor}
          fontSize="16px"
          mt={2}
          spanFontSize="10px"
          spanColor={theme.foreColor}
          lineHeight="12px"
          alignItems="baseline"
        >
          {points.toLocaleString()} <span>{description}</span>
        </SectionTitle>
      </LegendaryItemsContainter>

      <ItemPanel mode={INVENTORY_TYPE.LEGENDARY} src={theme.idleImage} />
      <LegendaryItemsContainter
        position="right"
        margin={isMobile ? '0px 0px 0px 16px' : '16px 0px 0px'}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="center" width="100%">
          <CountButton
            onClick={() => {
              if (amount >= 1 && !isBuying) setAmount(amount - 1);
            }}
            disabled={isBuyButtonDisabled}
            foreColor={theme.foreColor}
            activeColor={theme.backColor}
          >
            -
          </CountButton>
          <Label color={theme.foreColor} ml={1} mr={1} width={20}>
            {amount}
          </Label>
          <CountButton
            foreColor={theme.foreColor}
            activeColor={theme.backColor}
            onClick={() => !isBuying && setAmount(amount + 1)}
            disabled={isBuying || isLoading}
          >
            +
          </CountButton>
          {isMobile && (
            <BuyButton
              block
              margin="0px 0px 0px 16px"
              width="70%"
              disabled={isBuyButtonDisabled}
              onClick={handleClickBuy}
              foreColor={isBuyButtonDisabled ? theme.disabledForeColor : theme.foreColor}
              activeColor={theme.backColor}
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
          <BuyButton
            margin="16px 0px 0px"
            disabled={isBuyButtonDisabled}
            onClick={handleClickBuy}
            foreColor={isBuyButtonDisabled ? theme.disabledForeColor : theme.themeColor}
            activeColor={theme.backColor}
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
      </LegendaryItemsContainter>
    </LegendaryContainer>
  );
};

export default LegendaryItem;
