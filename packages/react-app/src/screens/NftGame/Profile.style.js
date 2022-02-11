import styled from 'styled-components';
import { fujiMedia } from 'consts';

import crownSVG from 'assets/images/nft-game/crown.svg';
import themeGet from '@styled-system/theme-get';

export const Container = styled.div`
  position: relative;
  padding: 10px;

  ${fujiMedia.greaterThan('small')`
    background: ${themeGet('colors.dark09')};
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    /* Note: backdrop-filter has minimal browser support */
    backdrop-filter: blur(6px);
    
    border-radius: 8px;
    padding: 24px

    margin: 16px;
    max-width: 390px;
  `}
`;

export const Username = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin-bottom: 24px;
  ${fujiMedia.greaterThan('small')`
    margin-top: 16px;
  `}
`;

export const Position = styled.div`
  text-align: center;
`;

export const PositionNumber = styled.p`
  font-weight: bold;
  font-size: 40px;
  line-height: 120%;

  &:before {
    display: block;
    content: url(${crownSVG});
  }

  &:after {
    display: inline-block;
    content: ' ';
    height: 0;
    width: 0;
    border-right: 6px solid transparent;
    border-bottom: 10px solid white;
    border-left: 6px solid transparent;
    bottom: 10px;
    position: relative;
    bottom: 8px;
    left: 8px;
  }
`;

export const PositionText = styled.p`
  font-size: 14px;
  line-height: 120%;
`;

export const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 80px;
`;

// TODO: Shall we add color #fa266c to theme colors ? Or simply create a UI component ?
export const StatsPoints = styled.div`
  font-weight: bold;
  font-size: 32px;
  line-height: 120%;
  color: #fa266c;

  &:after {
    display: inline-block;
    // content: ' ';
    height: 0;
    width: 0;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #fa266c;
    border-left: 6px solid transparent;
    bottom: 10px;
    position: relative;
    bottom: 8px;
    left: 8px;
  }
`;

export const StatsBoost = styled(StatsPoints)`
  color: #05ff00;
  &:after {
    display: none;
  }
`;

export const StatsLegend = styled.p`
  font-size: 14px;
  line-height: 120%;
  color: white;
`;

export const ClimbingSpeed = styled.div`
  padding: 24px;
  margin: 24px;

  ${fujiMedia.lessThan('small')`
    background: rgba(25, 25, 25, 0.56);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    backdrop-filter: blur(6px);
  `}

  /* Note: backdrop-filter has minimal browser support */
  border-radius: 8px;
`;
export const ClimbingSpeedTitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
`;
export const ClimbingSpeedText = styled.p`
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 16px;
`;
export const ClimbingSpeedPer = styled.p`
  font-size: 20px;
  line-height: 30px;

  & > strong {
    color: #fa266c;
  }
`;

export const Decoration = styled.img`
  position: absolute;
  opacity: 0.56;
  top: 74px;
`;
export const LeftDecoration = styled(Decoration)`
  left: 0px;
`;
export const RightDecoration = styled(Decoration)`
  right: 0px;
  transform: rotateY(0.5turn);
`;
