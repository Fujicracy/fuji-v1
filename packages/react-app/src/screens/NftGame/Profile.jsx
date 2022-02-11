import React from 'react';

import editSVG from 'assets/images/icons/edit.svg';
import decorationSvg from 'assets/images/nft-game/decorations.svg';

import {
  ClimbingSpeed,
  ClimbingSpeedPer,
  ClimbingSpeedText,
  ClimbingSpeedTitle,
  Container,
  LeftDecoration,
  Position,
  PositionNumber,
  PositionText,
  RightDecoration,
  Stats,
  StatsLegend,
  StatsPoints,
  StatsBoost,
  Username,
} from './Profile.style';

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
