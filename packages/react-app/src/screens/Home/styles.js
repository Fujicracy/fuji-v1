import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';
import media from 'styled-media-query';
import { fujiLanding, fujiLandingMobile } from '../../assets/images';

export const HomeContainer = styled(animated.div)`
  position: absolute;
  margin-top: 40px;
  /*padding-bottom: 40px;*/
  height: calc(100vh - 180px);
  left: 50%;
  transform: translateX(-50%);
  background-size: contain !important;

  ${media.lessThan('medium')`
    background: url(${fujiLandingMobile}) no-repeat center center;
    width: 70%;
  `}
  ${media.greaterThan('medium')`
    background: url(${fujiLanding}) no-repeat center center;
    width: 80%;
  `}
`;

export const HomeContent = styled.div`
  color: white;
  font-family: sans-serif;
  width: ${props => (props.isMobile ? '250px' : '330px')};
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
