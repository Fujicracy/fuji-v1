import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { CircularProgress } from '@material-ui/core';

import { BREAKPOINTS, BREAKPOINT_NAMES, CRATE_TYPE, NFT_GAME_MODAL_THEMES } from 'consts';
import { SectionTitle } from '../Blocks';
import { CountButton } from '../UI';
import {
  Container,
  BuyButton,
  InfoButton,
  CancelButton,
  ItemsContainer,
  AmountInput,
} from './styles';
import ItemInfo from './ItemInfo';
import commonBg from '../../assets/images/images/nft-game/common-crate_glow-min.jpg';
import epicBg from '../../assets/images/images/nft-game/epic-crate-glow.jpg';

const GeneralItem = ({ type = CRATE_TYPE.COMMON, title, price, description, onBuy, isLoading }) => {
  const [amount, setAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const isBuyButtonDisabled = isBuying || amount === 0 || isLoading;

  const theme = NFT_GAME_MODAL_THEMES[type];
  const backgroundImage =
    (type === CRATE_TYPE.COMMON && commonBg) || (type === CRATE_TYPE.EPIC && epicBg);

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
    <div className="animate__animated animate__fast animate__flipInY">
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
            color={theme.foreColor}
            onClick={() => {
              if (!isBuying && amount >= 1) setAmount(amount - 1);
            }}
            disabled={isBuyButtonDisabled}
            foreColor={isBuying ? theme.disabledForeColor : theme.foreColor}
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
            color={theme.foreColor}
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
          theme={theme}
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
    </div>
  );

  return (
    <Container
      backgroundColor={theme.backColor}
      color={theme.foreColor}
      mode={showInfo ? 'info' : 'general'}
      backgroundImage={!showInfo ? backgroundImage : ''}
      justifyContent="space-between"
    >
      {showInfo ? (
        <CancelButton onClick={() => setShowInfo(false)} />
      ) : (
        <InfoButton onClick={() => !isBuying && setShowInfo(true)} />
      )}
      <ItemsContainer>
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
          {price.toLocaleString()} <span>{description}</span>
        </SectionTitle>
      </ItemsContainer>
      {body}
    </Container>
  );
};

export default GeneralItem;
