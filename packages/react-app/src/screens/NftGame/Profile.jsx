import React from 'react';
import { ethers } from 'ethers';
import { useAuth, useContractLoader, useContractReader } from 'hooks';

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

  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [
    address,
    0, // TODO
  ]);
  const points = debtBalance ? Number(ethers.utils.formatEther(debtBalance)) : 0;
  // console.log(points);

  const [, speedPerSecond] = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeed = speedPerSecond
    ? Number(ethers.utils.formatEther(speedPerSecond)) * 60 * 60 * 24 * 7
    : 0;
  // console.log(climbingSpeed);

  // TODO: Better to do it backend / game side ?
  // TODO: At least split logic in a hook "useBoost"
  // Question: How do I know how much boost each token is. Hardcoded ?
  const boost4 = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 4]);
  // const boost5 = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 5]);
  // and so on...

  const boost = 0; // in percent
  console.log(boost4);
  console.log(boost4 && boost4.isZero());
  // if (!boost4?.isZero()) {
  //   boost += 5;
  // }
  // if (!boost5?.isZero()) {
  //   boost += 5;
  // }
  // and so on...

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
          <StatsPoints>{points?.toFixed(0)}</StatsPoints>
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
          <strong>{climbingSpeed?.toFixed(2)}m</strong> per week
        </ClimbingSpeedPer>
        <ClimbingSpeedPer>
          <strong>12,549m</strong> per day
        </ClimbingSpeedPer>
      </ClimbingSpeed>
    </Container>
  );
}

export default Profile;
