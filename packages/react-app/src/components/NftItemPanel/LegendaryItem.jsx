import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_TYPE, NFT_GAME_MODAL_THEMES } from 'consts';
import { SectionTitle } from '../Blocks';
import { CountButton } from '../UI';
import {
  BuyButton,
  LegendaryItemsContainer,
  LegendaryContainer,
  InfoButton,
  CancelButton,
  AmountInput,
} from './styles';
import ItemInfo from './ItemInfo';
import legendaryBg from '../../assets/images/images/nft-game/legendary_crate_glow-min.jpg';

const LegendaryItem = ({ price, description, onBuy, isLoading }) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const isBuyButtonDisabled = isBuying || amount === 0 || isLoading;

  const theme = NFT_GAME_MODAL_THEMES[CRATE_TYPE.LEGENDARY];

  const handleClickBuy = async () => {
    if (isBuying) return;

    try {
      setIsBuying(true);
      const res = await onBuy(CRATE_TYPE.LEGENDARY, amount);
      if (res) setAmount(0);
    } catch (error) {
      console.error('minting inventory error:', { error });
    }
    setIsBuying(false);
  };

  const body = showInfo ? (
    <ItemInfo type={CRATE_TYPE.LEGENDARY} />
  ) : (
    <div className="animate__animated animate__fast animate__flipInY">
      {/* <ItemPanel mode={CRATE_TYPE.LEGENDARY} src={theme.idleImage} /> */}
      <LegendaryItemsContainer
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
          <AmountInput
            value={amount}
            theme={theme}
            type="number"
            onChange={e => setAmount(parseInt(e.target.value, 10))}
            disabled={isBuying || isLoading}
          />
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
      </LegendaryItemsContainer>
    </div>
  );

  return (
    <LegendaryContainer
      color={theme.foreColor}
      backgroundColor={theme.backColor}
      mode={showInfo ? 'info' : undefined}
      backgroundImage={!showInfo && !isMobile ? legendaryBg : ''}
    >
      {showInfo ? (
        <CancelButton onClick={() => setShowInfo(false)} />
      ) : (
        <InfoButton onClick={() => !isBuying && setShowInfo(true)} />
      )}
      <LegendaryItemsContainer>
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
          {price.toLocaleString()} <span>{description}</span>
        </SectionTitle>
      </LegendaryItemsContainer>

      {body}
    </LegendaryContainer>
  );
};

export default LegendaryItem;
