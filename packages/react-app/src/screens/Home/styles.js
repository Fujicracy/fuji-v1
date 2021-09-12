import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';
import media from 'styled-media-query';

export const HomeContainer = styled(animated.div)`
  background-size: contain !important;
  margin: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: sans-serif;
  text-align: center;

  ${media.lessThan('medium')`
    margin: 56px;
  `}
  ${media.greaterThan('medium')`
    margin: 56px;
  `}
  ${media.greaterThan('large')`
    margin: 0px 128px;
  `}
`;

export const HomeCta = styled(Grid)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
  padding: 20px;
  max-width: 400px;
`;
