import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';
import { Flex } from 'rebass';
import { fujiMedia } from 'consts';

export const HomeAnimatedContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  color: white;
  font-family: Poppins;
  text-align: center;
  align-items: center;
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  font-family: Poppins;
  text-align: center;
  align-items: center;
  width: calc(100% - 120px);
  ${fujiMedia.lessThan('medium')`
    width: 100%;
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

export const VerticalLine = styled.div`
  border-left: 2px dashed white;
  height: 95%;
  margin: 0px 72px 0px 72px;
`;

export const PageContainter = styled(Flex).attrs(() => ({
  bg: 'transparent',
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 100px);
  ${fujiMedia.lessThan('medium')`
    height: 100%;
  `}
`;
