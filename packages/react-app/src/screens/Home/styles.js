import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';

export const HomeContainer = styled(animated.div)`
  position: absolute;
  margin-top: 40px;
  /*padding-bottom: 40px;*/
  height: calc(100vh - 180px);
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background-size: contain !important;
`;

export const HomeContent = styled.div`
  color: white;
  font-family: sans-serif;
  width: 330px;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: ${props => (props.isMobile ? '-130px' : '-100px')};
`;

export const HomeCta = styled(Grid)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
