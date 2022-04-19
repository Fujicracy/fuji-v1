import React from 'react';
import { Link, Text } from 'rebass';
import styled from 'styled-components';

import { BlackBoxContainer, SectionTitle } from 'components';

import { HorizontalLine } from './styles';

const Ol = styled.ol`
  list-style: number;
  margin-left: 1rem;
`;
const Li = styled.li`
  margin-bottom: 0.5rem;
`;

const Details = styled.details`
  &[open] summary ~ * {
    animation: fadeIn;
    animation-duration: 0.6s;
  }
`;

const Summary = styled.summary`
  cursor: pointer;

  &::marker {
    font-size: 1.5rem;
  }
`;

// Can't find how to remove an attribute with react, looks like it's not possible so I had to use this hack
const DetailsWithOpen = props =>
  props.open ? <Details open>{props.children}</Details> : <Details>{props.children}</Details>;

const Rules = ({ margin, open = false }) => (
  <BlackBoxContainer
    borderRadius="8px"
    color="white"
    height="fit-content"
    width={[1]}
    m={margin}
    p="24px"
  >
    <DetailsWithOpen open={open}>
      <Summary>
        <SectionTitle fontSize="1.5rem" lineHeight="2rem" display="inline">
          How to play?
        </SectionTitle>
      </Summary>
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
        <Link
          href="https://docs.google.com/document/d/1ftYFOWXBK0r-9VGrHooNZpdS13hhjrerKTgWTpg0yow"
          color="#fa266c"
        >
          Documentation
        </Link>{' '}
        and {/* TODO: Link */}
        <Link href="https://github.com/Fujicracy/" color="#fa266c">
          Medium page.
        </Link>
      </Text>
    </DetailsWithOpen>
  </BlackBoxContainer>
);

export default Rules;
