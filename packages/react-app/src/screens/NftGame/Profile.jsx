import React from 'react';
import styled from 'styled-components';
import { fujiMedia } from 'consts';

import crownSVG from 'assets/images/nft-game/crown.svg';
import editSVG from 'assets/images/icons/edit.svg';
import decorationSvg from 'assets/images/nft-game/decorations.svg';

// TODO: Use vars in style
const Container = styled.div`
  position: relative;
  padding: 10px;

  ${fujiMedia.greaterThan('mobile')`
    background: rgba(25, 25, 25, 0.56);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    backdrop-filter: blur(6px);
    
    /* Note: backdrop-filter has minimal browser support */
    border-radius: 8px;
    padding: 24px

    margin: 16px;
    max-width: 390px;
  `}
`;

const Username = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin-bottom: 24px;
  ${fujiMedia.greaterThan('mobile')`
    margin-top: 16px;
  `}
`;

const Position = styled.div`
  text-align: center;
`;

const PositionNumber = styled.p`
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

const PositionText = styled.p`
  font-size: 14px;
  line-height: 120%;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 80px;
`;

const StatsPoints = styled.div`
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

const StatsBoost = styled(StatsPoints)`
  color: #05ff00;
  &:after {
    display: none;
  }
`;

const StatsLegend = styled.p`
  font-size: 14px;
  line-height: 120%;
  color: white;
`;

const ClimbingSpeed = styled.div`
  padding: 24px;
  margin: 24px;

  ${fujiMedia.lessThan('mobile')`
    background: rgba(25, 25, 25, 0.56);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
    backdrop-filter: blur(6px);
  `}

  /* Note: backdrop-filter has minimal browser support */
  border-radius: 8px;
`;
const ClimbingSpeedTitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
`;
const ClimbingSpeedText = styled.p`
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 16px;
`;
const ClimbingSpeedPer = styled.p`
  font-size: 20px;
  line-height: 30px;

  & > strong {
    color: #fa266c;
  }
`;

const Decoration = styled.img`
  position: absolute;
  opacity: 0.56;
  top: 74px;
`;
const LeftDecoration = styled(Decoration)`
  left: 0px;
`;
const RightDecoration = styled(Decoration)`
  right: 0px;
  transform: rotateY(0.5turn);
`;

function Profile() {
  return (
    <Container>
      <LeftDecoration src={decorationSvg} />
      <RightDecoration src={decorationSvg} />

      <Username>
        {/* TODO: Edit button */}
        GringoClimb69 <img src={editSVG} alt="edit username" />
      </Username>

      <Position>
        <PositionNumber>12</PositionNumber>
        <PositionText>Position</PositionText>
      </Position>

      <Stats>
        <div>
          <StatsPoints>23 459</StatsPoints>
          <StatsLegend>Points</StatsLegend>
        </div>
        <div>
          <StatsBoost>60%</StatsBoost>
          <StatsLegend>Boost</StatsLegend>
        </div>
      </Stats>

      <ClimbingSpeed>
        <ClimbingSpeedTitle>Climbing speed</ClimbingSpeedTitle>
        <ClimbingSpeedText>
          The climbing speed is the lorem ipsum of the dolor sit amen.
        </ClimbingSpeedText>
        <ClimbingSpeedPer>
          <strong>87,843m</strong> per week
        </ClimbingSpeedPer>
        <ClimbingSpeedPer>
          <strong>12,549m</strong> per day
        </ClimbingSpeedPer>
      </ClimbingSpeed>
    </Container>
  );
}

export default Profile;
