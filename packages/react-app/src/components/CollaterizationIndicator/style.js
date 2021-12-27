import styled from 'styled-components';
import { animated } from 'react-spring';

export const AnimatedCircle = styled(animated.path)`
  fill: none;
  stroke-width: 2.6;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
`;

export const AnimatedLine = styled(animated.path)`
  height: 10px;
  width: 100%;
  border: 50% solid red;
  fill: none;
  stroke-width: 2.6;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
`;

export const SvgContainer = styled.svg`
  -webkit-filter: ${props =>
    props.filterColor && `drop-shadow(0rem 0rem 0.25rem ${props.filterColor})`};
  filter: ${props => props.filterColor && `drop-shadow(0rem 0rem 0.25rem ${props.filterColor})`};
`;

export const InnerProgress = styled.div`
  display: block;
  width: 100%;
  height: 16px;
  background: linear-gradient(180deg, rgba(33, 33, 33) 6.82%, rgb(44, 44, 44) 100%);
  border-radius: 16px;
`;

export const ChartBackground = styled.div`
  position: absolute;
  top: 0rem;
  left: 0rem;
  border-radius: 4.375rem;
  width: 8.75rem;
  height: 8.75rem;
  background: linear-gradient(180deg, rgba(13, 12, 12, 0.64) 45%, var(--bg64) 160%);
  border: 0.063rem solid var(--bg);
  box-sizing: border-box;
  box-shadow: inset -0.125rem -0.25rem 0.188rem rgba(66, 50, 55, 0.64);
  &: before {
    content: '';
    z-index: 1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 7.125rem;
    height: 7.125rem;
    border-radius: 3.75rem;
    border: 0.063rem solid var(--text05);
    background: linear-gradient(140deg, #2a2a2a 14%, #101010 86%);
    box-shadow: -0.125rem -0.25rem 0.188rem rgba(66, 50, 55, 0.64);
  }
  &: after {
    content: '';
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 5.75rem;
    height: 5.75rem;
    border-radius: 3rem;
    background: #191919;
    border: 0.063rem solid var(--text05);
  }
`;

export const Ratio = styled.div`
  position: relative;
  width: 8.75rem;
  height: 8.75rem;
  margin: 24px auto;
`;

export const ChartContainer = styled.div`
  position: absolute;
  z-index: 3;
  width: 8.75rem;
  justify-content: space-around;
`;

export const ChartContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  font-size: 1.25rem;
  color: var(--text64);
`;
