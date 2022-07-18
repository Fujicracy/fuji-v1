import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Box, Button, Flex, Image, Text } from 'rebass';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import Countdown from 'react-countdown';

import { BlackBoxContainer, ExternalLink, Loader, LockingCeremonyPopup } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_MARKETPLACE_LINK } from 'consts';
import { useContractLoader, useContractReader, useGearsBalance, useSouvenirNFT } from 'hooks';
import GearSet from 'components/GearSet';
import { HorizontalLine } from './styles';
import { NavLink } from 'react-router-dom';

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
    cursor: pointer;
    opacity: 0.8;
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ButtonLink = styled(NavLink)`
  color: white;
  background-color: #fe3477;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  margin-top: 16px;
`;

const NftImage = styled(Image)`
  border-radius: 600px;
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 28px rgba(250, 38, 108, 0.5), 0 0 10px rgba(250, 38, 108, 0.4);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    box-shadow: 0 14px 28px rgba(250, 38, 108, 0.5), 0 10px 10px rgba(250, 38, 108, 0.5) !important;
  }
`;

const CountDownLabel = ({ label, value }) => (
  <Flex flexDirection="column" textAlign="center" minWidth="60px">
    <Text color="#fa266c" fontSize="2rem" fontWeight="bold" p={1}>
      {String(value).padStart(2, '0')}
    </Text>
    <Text color="white" fontSize="1rem" p={1}>
      {label}
    </Text>
  </Flex>
);

function BeforeLockRenderer({ days, hours, minutes, seconds, completed }) {
  let message;

  if (days >= 7) {
    message = 'You still have time to lock in your points';
  } else if (days >= 1) {
    message = 'Last week to trade';
  } else if (hours >= 1) {
    message = 'Last day. We recommend you to lock in now';
  } else if (!completed) {
    message = 'Hurry up 😱';
  } else if (completed) {
    message = 'Locking phase is over, please proceed to the Bond Factory';
  }

  return (
    <Box textAlign="center">
      <Flex justifyContent="center" mt={4}>
        {days && <CountDownLabel label="days" value={days} />}
        <CountDownLabel label="hours" value={hours} />
        <CountDownLabel label="minutes" value={minutes} />
        {!days && <CountDownLabel label="seconds" value={seconds} />}
      </Flex>
      <Text color="white" fontSize={2} pt={3}>
        {message}
      </Text>
    </Box>
  );
}

function BeforeOpenRenderer({ days, hours, minutes, seconds }) {
  const message = 'remaining before Locking Cermony opens';

  return (
    <Box textAlign="center">
      <Flex justifyContent="center" mt={4}>
        {days && <CountDownLabel label="days" value={days} />}
        <CountDownLabel label="hours" value={hours} />
        <CountDownLabel label="minutes" value={minutes} />
        {!days && <CountDownLabel label="seconds" value={seconds} />}
      </Flex>
      <Text color="white" fontSize={2} pt={3}>
        {message}
      </Text>
    </Box>
  );
}

function LockingCeremony() {
  const contracts = useContractLoader();

  const start = useContractReader(contracts, 'NFTGame', 'gamePhaseTimestamps', [1], 0);
  const startTimestamp = start ? Number(start.toString()) * 1000 : undefined;

  const end = useContractReader(contracts, 'NFTGame', 'gamePhaseTimestamps', [3], 0);
  const endTimestamp = end ? Number(end.toString()) * 1000 : undefined;

  const { gears: nftGears } = useGearsBalance();
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const { isLoading, NFTImage } = useSouvenirNFT();
  const ready = endTimestamp && nftGears && !isLoading;

  if (!ready) {
    return (
      <BlackBoxContainer width="860px" hasBlackContainer={!isMobile} borderRadius="8px" p={5}>
        <Loader style={{ width: '56px', height: 'auto', margin: 'auto' }} />
      </BlackBoxContainer>
    );
  }

  if (NFTImage) {
    return (
      <BlackBoxContainer width="860px" hasBlackContainer={!isMobile} borderRadius="8px" mb="88px">
        <Box
          backgroundColor="#F7EDE8"
          borderRadius="8"
          p="3rem 4rem"
          style={{ borderRadius: '8px 8px 0 0' }}
        >
          <Text fontSize="1.5rem" lineHeight="1.7rem" textAlign="justify">
            "There are many paths leading to the top of Mount Fuji, but there is only one summit -
            love."
          </Text>
          <Text textAlign="right">Morihei Ueshiba</Text>
        </Box>
        {/* flexWrap="wrap" */}
        <Flex color="white" p={[3, 5]}>
          <Box width={[1, 0.5]}>
            <NftImage src={NFTImage} />
          </Box>
          <Box width={[1, 0.5]} ml={[3, 5]}>
            <Text fontSize="2rem" lineHeight="2rem" fontWeight="bold">
              Next Steps
            </Text>
            <br />
            <Text fontSize="1rem" lineHeight="1.2rem">
              1. All your locked meter points will enable you to obtain pre-tokens bonds.
            </Text>
            <Text fontSize="1rem" lineHeight="1.2rem">
              2. You choose your vesting period from 3 months to 12 months.
            </Text>
            {/* TODO: will the name be $FUJI ? */}
            <Text fontSize="1rem" lineHeight="1.2rem">
              3. At the end of the vesting period, you will receive the respective Fuji tokens.
            </Text>

            <ButtonLink to="bond-factory">Go to bond factory</ButtonLink>
          </Box>
        </Flex>
      </BlackBoxContainer>
    );
  }

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <LockingCeremonyPopup
        isOpen={popupIsOpen}
        close={() => setPopupIsOpen(false)}
        onSuccess={() => setPopupIsOpen(false)}
      />

      <Text color="white" fontSize={4} fontWeight={500}>
        Locking Ceremony
      </Text>
      {startTimestamp < Date.now() && (
        <Text color="white" fontSize="14px" mt="8px">
          Congratulations! You are about to summit.
        </Text>
      )}

      <Text color="white" fontSize="1rem" mt="4">
        You can still trade Climbing Gears on the
        <ExternalLink href={NFT_GAME_MARKETPLACE_LINK}> marketplace</ExternalLink>.
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
          nftGears.map(nftGear => (
            <GearSet nftGear={nftGear} width="100px" hover={false} key={nftGear.id} />
          ))}
      </Carousel>
      <HorizontalLine margin="16px 0px 24px" />

      <Text color="white" fontSize={2} lineHeight="1.5">
        {startTimestamp > Date.now()
          ? "After the accumulation period ends, you will be required to perform the Locking Ceremony during which you will have to throw your Climbing Gear into Mt. Fuji's lava pit and watch it combust into a volcanic eruption. "
          : "Now it is time to move on to the next phase, which is to throw your Climbing Gear into Mt. Fuji's lava pit and watch it combust into a volcanic eruption. Don't worry, out of the ashes you will receive your achievement immortalized into an NFT with your address, position, and points accumulated during your climb."}
      </Text>

      {startTimestamp > Date.now() ? (
        <Countdown date={startTimestamp} renderer={BeforeOpenRenderer} />
      ) : (
        <>
          {endTimestamp && <Countdown date={endTimestamp} renderer={BeforeLockRenderer} />}

          <Box textAlign="center">
            <ConsumateButton
              mt={4}
              onClick={() => setPopupIsOpen(true)}
              disabled={endTimestamp < Date.now()}
            >
              Consumate the Ceremony
            </ConsumateButton>
          </Box>
        </>
      )}
    </BlackBoxContainer>
  );
}
export default LockingCeremony;
