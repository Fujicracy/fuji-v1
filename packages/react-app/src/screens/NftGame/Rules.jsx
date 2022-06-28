import React from 'react';
import { Text } from 'rebass';
import styled from 'styled-components';

import { BlackBoxContainer, ExternalLink, SectionTitle } from 'components';

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
  &[open] summary::marker {
    content: '- ';
  }

  &:not([open]) summary:hover {
    animation: pulse;
    animation-duration: 1s;
  }
`;

const Summary = styled.summary`
  cursor: pointer;
  text-align: center;

  &::marker {
    font-size: 1.2rem;
    content: '+ ';
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
    p="16px 24px"
  >
    <DetailsWithOpen open={open}>
      <Summary>
        <SectionTitle fontSize="1.2rem" lineHeight="2rem" display="inline">
          How to play?
        </SectionTitle>
      </Summary>
      <HorizontalLine margin="1rem 0rem" />
      <Ol>
        <Li>
          The more DAI or USDC you borrow on Fantom, the faster you climb and earn meter points.
        </Li>
        <Li>Buy and open crates to find a Climbing Gear NFT that boosts your score.</Li>
        <Li>Collect the full gear set to double your final meter points.</Li>
        <Li>Trade gears on the open market at any time before the Locking Ceremony.</Li>
      </Ol>
      <Text mt="1rem">
        Learn more about the{' '}
        <ExternalLink href="https://docs.fujidao.org/climbing-fantom-expedition/rules-and-mechanics">
          rules & mechanics
        </ExternalLink>{' '}
        and read{' '}
        <ExternalLink href="https://medium.com/fuji-finance/fuji-climb-fantom-expedition-29e01cdca752">
          the annoucement
        </ExternalLink>
        .
      </Text>
    </DetailsWithOpen>
  </BlackBoxContainer>
);

export default Rules;
