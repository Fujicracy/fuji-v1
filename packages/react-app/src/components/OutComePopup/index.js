import React, { useState } from 'react';
import { Flex } from 'rebass';
import { useHistory } from 'react-router-dom';

import { NFT_GAME_MODAL_THEMES, NFT_IDS, NFT_ITEMS } from 'consts';
import { BlackButton } from 'components/UI';
import { OpacityImage } from 'components/InventoryPopup/styles';
import GearSet from 'components/GearSet';
import { SectionTitle } from 'components/Blocks';

import {
  StyledModal,
  CarouselContainer,
  CloseButton,
  ItemContainer,
  RoundedAmountContainer,
} from './styles';

const carouselResponsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 3,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 2,
    partialVisibilityGutter: 30,
  },
};

const OutComePopup = ({ isOpen, onClose, isLoading = false, outComes, crateType }) => {
  const [opacity, setOpacity] = useState(0);
  const history = useHistory();

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

  const theme = NFT_GAME_MODAL_THEMES[crateType];
  return (
    <StyledModal
      color={theme.foreColor}
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      backgroundColor={theme.backColor}
      opacity={opacity}
      padding="2rem"
    >
      <OpacityImage src={theme.backMask} height="100%" />
      <CloseButton onClick={isLoading ? undefined : onClose} />
      <SectionTitle color={theme.foreColor} fontSize="20px" fontWeight="bold">
        Rewards
      </SectionTitle>
      <CarouselContainer
        additionalTransfrom={0}
        arrows
        autoPlay
        autoPlaySpeed={3000}
        infinite
        containerClass="carousel-container"
        draggable
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        centerMode={false}
        responsive={carouselResponsive}
        showDots={false}
        sliderClass=""
        slidesToSlide={2}
        swipeable
      >
        {Object.keys(outComes).map(outKey => {
          if (outKey === NFT_IDS.NOTHING) {
            return (
              <ItemContainer key={outKey} backgroundColor={theme.backColor}>
                <RoundedAmountContainer>{outComes[outKey].count}</RoundedAmountContainer>
                <SectionTitle color={theme.foreColor} fontSize="20px">
                  Empty
                </SectionTitle>
              </ItemContainer>
            );
          }
          if (outKey === NFT_IDS.POINTS.toString()) {
            return (
              <ItemContainer key={outKey} backgroundColor={theme.backColor}>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <RoundedAmountContainer>{outComes[outKey].count}</RoundedAmountContainer>
                  <SectionTitle color={theme.foreColor} fontSize="20px">
                    {outComes[outKey].amount}
                  </SectionTitle>
                  <SectionTitle color={theme.foreColor} fontSize="20px" mt={3}>
                    Meter Points
                  </SectionTitle>
                </Flex>
              </ItemContainer>
            );
          }
          return (
            <GearSet
              key={NFT_ITEMS[outKey].name}
              width="180px"
              textColor={theme.foreColor}
              nftGear={{
                balance: outComes[outKey].count,
                name: NFT_ITEMS[outKey].name,
                boost: '10',
                images: { medium: NFT_ITEMS[outKey].images.medium },
              }}
            />
          );
        })}
      </CarouselContainer>
      <Flex>
        <BlackButton style={{ marginRight: '8px' }} onClick={() => history.push('/nft-game/store')}>
          Store
        </BlackButton>
        <BlackButton onClick={onClose}>Inventory</BlackButton>
      </Flex>
    </StyledModal>
  );
};

export default OutComePopup;