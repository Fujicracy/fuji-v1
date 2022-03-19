import React, { useState } from 'react';
import { Flex, Image } from 'rebass';

import { NFT_GAME_MODAL_THEMES, CRATE_CARD_IDS, NFT_GEARS } from 'consts';

import { giftBoxImage } from 'assets/images';

import SectionTitle from '../Blocks/SectionTitle';
import {
  StyledModal,
  CarouselContainer,
  CloseButton,
  ItemContainer,
  RoundedAmountContainer,
} from './styles';

const OutComePopup = ({ isOpen, onClose, isLoading = false, outComes, crateType }) => {
  const [opacity, setOpacity] = useState(0);

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

  console.log({ outComes });
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
      <CloseButton onClick={isLoading ? undefined : onClose} />
      <CarouselContainer
        additionalTransfrom={0}
        arrows
        autoPlay={false}
        // autoPlaySpeed={3000}
        containerClass="carousel-container"
        draggable
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        // centerMode={Object.keys(outComes).length < 3}
        centerMode={false}
        responsive={{
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
        }}
        showDots={false}
        sliderClass=""
        slidesToSlide={2}
        swipeable
      >
        {Object.keys(outComes).map(outKey => (
          <ItemContainer key={outKey}>
            <RoundedAmountContainer>{outComes[outKey].count}</RoundedAmountContainer>
            {outKey === CRATE_CARD_IDS.NOTHING ? (
              <SectionTitle color={theme.foreColor} fontSize="20px">Empty</SectionTitle>
            ) : outKey === CRATE_CARD_IDS.POINTS.toString() ? (
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <SectionTitle color={theme.foreColor} fontSize="20px">{outComes[outKey].amount}</SectionTitle>
                <SectionTitle color={theme.foreColor} fontSize="20px" mt={3}>
                  Meter Points
                </SectionTitle>
              </Flex>
            ) : (
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Image src={giftBoxImage} width="140px" height="140px" />
                <SectionTitle color={theme.foreColor} fontSize="20px" mt={3}>
                  {NFT_GEARS[outKey].name}
                </SectionTitle>
              </Flex>
            )}
          </ItemContainer>
        ))}
      </CarouselContainer>
    </StyledModal>
  );
};

export default OutComePopup;
