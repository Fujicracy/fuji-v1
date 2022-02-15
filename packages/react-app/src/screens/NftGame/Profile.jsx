import React from 'react';
import { useAuth, useContractLoader, useContractReader } from 'hooks';
import { formatUnits } from '@ethersproject/units';

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
  const { address } = useAuth();
  const contracts = useContractLoader();

  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? formatUnits(debtBalance, 5) : 0;

  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1]
    ? formatUnits(userdata[1].toNumber(), 5) * 60 * 60 * 24
    : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  const boost = 0; // in percent

  return (
    <Container>
      <LeftDecoration src={decorationSvg} />
      <RightDecoration src={decorationSvg} />

      <Username>
        GringoClimb69 <img src={editSVG} alt="edit username" />
      </Username>

      <Position>
        <PositionNumber>12</PositionNumber>
        <PositionText>Position</PositionText>
      </Position>

      <Stats>
        <div>
          <StatsPoints>{points?.toLocaleString('en-US')}</StatsPoints>
          <StatsLegend>Points</StatsLegend>
        </div>
        <div>
          <StatsBoost>{boost}%</StatsBoost>
          <StatsLegend>Boost</StatsLegend>
        </div>
      </Stats>

      <ClimbingSpeed>
        <ClimbingSpeedTitle>Climbing speed</ClimbingSpeedTitle>
        <ClimbingSpeedText>
          The climbing speed is the lorem ipsum of the dolor sit amen.
        </ClimbingSpeedText>
        <ClimbingSpeedPer>
          <strong>{climbingSpeedPerWeek?.toLocaleString('en-US')}</strong> points per week
        </ClimbingSpeedPer>
        <ClimbingSpeedPer>
          <strong>{climbingSpeedPerDay?.toLocaleString('en-US')}</strong> points per day
        </ClimbingSpeedPer>
      </ClimbingSpeed>
    </Container>
  );
}

export default Profile;
