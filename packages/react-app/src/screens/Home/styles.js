import styled from 'styled-components';
import { animated } from 'react-spring';
import { Grid } from '@material-ui/core';
import media from 'styled-media-query';
import { fujiLanding, fujiLandingMobile, fujiLandingTablet } from '../../assets/images';

export const HomeContainer = styled(animated.div)`
  position: absolute;
  margin-top: 40px;
  height: calc(100vh - 180px);
  left: 50%;
  transform: translateX(-50%);
  background-size: contain !important;

  ${media.lessThan('medium')`
    background: url(${fujiLandingMobile}) no-repeat center center;
    width: 280px;
  `}
  ${media.greaterThan('medium')`
    background: url(${fujiLandingTablet}) no-repeat center center;
    width: 512px;
  `}
  ${media.greaterThan('large')`
    background: url(${fujiLanding}) no-repeat center center;
    width: 990px;
  `}
`;

export const HomeContent = styled.div`
  color: white;
  font-family: sans-serif;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  ${media.lessThan('medium')`
    width:250px;
    bottom:-130px;
  `}
  ${media.greaterThan('medium')`
    width: 380px;
    bottom:-32px;
  `}
  ${media.greaterThan('large')`
    width:330px;
    bottom:-70px;
  `}
`;

export const HomeCta = styled(Grid)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
