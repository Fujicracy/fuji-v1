import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';

export const HomeContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  color: white;
  font-family: sans-serif;
  text-align: center;
  height: 100%;
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
