import React, { useState } from 'react';
import { Flex, Text } from 'rebass';
import { useHistory } from 'react-router-dom';

import { NFT_GAME_MODAL_THEMES, NFT_IDS, NFT_ITEMS } from 'consts';
import { BlackButton } from 'components/UI';
import { OpacityImage } from 'components/InventoryPopup/styles';
import GearSet from 'components/GearSet';
import { SectionTitle } from 'components/Blocks';
import { emptyCrateAnimation, meterPointCrateAnimation } from 'assets/images';

import { StyledModal, CarouselContainer, CloseButton, ItemContainer } from './styles';

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
  const theme = NFT_GAME_MODAL_THEMES[crateType];

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
        containerClass="carousel-container"
        draggable
        minimumTouchDrag={80}
        responsive={carouselResponsive}
        showDots={false}
        swipeable
      >
        {Object.keys(outComes).map(outKey => {
          if (outKey === NFT_IDS.NOTHING) {
            return (
              <div>
                <ItemContainer key={outKey} backgroundColor={theme.backColor}>
                  <video autoPlay muted loop width="180" height="180">
                    <source src={emptyCrateAnimation} type="video/mp4" />
                  </video>
                </ItemContainer>
                <Text color={theme.foreColor} textAlign="center" fontSize="1rem" mt="1">
                  <Text fontWeight="bold" display="inline">
                    {outComes[outKey].count}x
                  </Text>{' '}
                  Empty
                </Text>
              </div>
            );
          }
          if (outKey === NFT_IDS.POINTS.toString()) {
            return (
              <div>
                <ItemContainer key={outKey} backgroundColor={theme.backColor}>
                  <video autoPlay muted loop width="180" height="180">
                    <source src={meterPointCrateAnimation} type="video/mp4" />
                  </video>
                </ItemContainer>
                <Text color={theme.foreColor} textAlign="center" fontSize="1rem" mt="1">
                  <Text fontWeight="bold" display="inline">
                    {outComes[outKey].amount}
                  </Text>{' '}
                  meter points
                </Text>
              </div>
            );
          }
          return (
            <GearSet
              key={NFT_ITEMS[outKey].name}
              width="180px"
              textColor={theme.foreColor}
              hover={false}
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
