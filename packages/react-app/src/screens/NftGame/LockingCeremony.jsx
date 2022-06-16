import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button, Text } from 'rebass';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';

import { BlackBoxContainer, ExternalLink } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_MARKETPLACE_LINK } from 'consts';
import { useGearsBalance } from 'hooks';
import GearSet from 'components/GearSet';
import { HorizontalLine } from './styles';

const carouselResponsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 5,
    partialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 2,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 3,
    partialVisibilityGutter: 30,
  },
};

const ConsumateButton = styled(Button)`
  background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.8;
  }
`;

function LockingCeremony() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const { gears: nftGears } = useGearsBalance();

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Text color="white" fontSize={4} fontWeight={500}>
        Congratulations!
      </Text>
      <Text color="white" fontSize="14px" mt="8px">
        You are about to summit.
      </Text>

      <Text color="white" fontSize="1rem" mt="4">
        You can still trade Climbing Gears on the
        <ExternalLink href={NFT_GAME_MARKETPLACE_LINK}> marketplace</ExternalLink>
      </Text>

      <HorizontalLine margin="16px 0px 24px" />
      <Carousel
        additionalTransfrom={0}
        arrows
        containerClass="carousel-container"
        draggable
        minimumTouchDrag={80}
        responsive={carouselResponsive}
        showDots={false}
        swipeable
      >
        {nftGears.length > 0 &&
          nftGears.map(nftGear => <GearSet nftGear={nftGear} width="100px" hover={false} />)}
      </Carousel>
      <HorizontalLine margin="16px 0px 24px" />

      <Text color="white" fontSize={2}>
        Now it is time to move on to the next phase, which is to throw your Climbing Gear into Mt.
        Fuji&apos;s lava pit and watch it combust into a volcanic eruption. Don&apos;t worry, out of
        the ashes you will receive your achievement immortalized into an NFT with your name,
        position, and points accumulated during your climb.
      </Text>

      <ConsumateButton mt={4}>Consumate the Ceremony</ConsumateButton>
    </BlackBoxContainer>
  );
}
export default LockingCeremony;
