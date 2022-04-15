import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, Text } from 'rebass';
import styled from 'styled-components';

import { BlackBoxContainer, SectionTitle } from 'components';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import { HorizontalLine } from './styles';

const Ol = styled.ol`
  list-style: number;
  margin-left: 1rem;
`;
const Li = styled.li`
  margin-bottom: 0.5rem;
`;

const Details = styled.details`
  cursor: pointer;

  &[open] summary ~ * {
    animation: fadeIn;
    animation-duration: 0.6s;
  }

  & summary::marker {
    font-size: 1.5rem;
  }
`;

const Rules = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <BlackBoxContainer
      p="40px 24px"
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      color="white"
      height="fit-content"
    >
      <Details>
        <summary>
          <SectionTitle fontSize="1.5rem" lineHeight="2rem" display="inline">
            How to play?
          </SectionTitle>
        </summary>
        <HorizontalLine margin="1rem 0rem" />
        <Ol>
          <Li>
            The more DAI or USDC that you borrow on Fantom, the faster you will climb and earn meter
            points
          </Li>
          <Li>Collect the full Climbing Gear NFT set to double your final meter points count</Li>
          <Li>
            You can trade your gears on the open market (X) at any time before the Locking Ceremony
          </Li>
          <Li>
            The Booster Score reflects the NFTs in your Inventory. Only one of each type is required
            to boost your score
          </Li>
        </Ol>
        <Text mt="1rem">
          For more visit our{' '}
          <Link href="https://github.com/Fujicracy/" color="#fa266c">
            Documentation
          </Link>{' '}
          and{' '}
          <Link href="https://github.com/Fujicracy/" color="#fa266c">
            Medium page.
          </Link>
        </Text>
      </Details>
    </BlackBoxContainer>
  );
};

export default Rules;
