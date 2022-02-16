import React from 'react';
import { useAuth, useContractLoader, useContractReader } from 'hooks';
import { formatUnits } from '@ethersproject/units';
import { Flex, Image } from 'rebass';

import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { BlackBoxContainer, Label, SectionTitle } from 'components';
import { crownImage, editIcon, profileDecorationImage } from 'assets/images';
import {
  ClimbingSpeedPer,
  ProfileDecoration,
  StatsPoints,
  StatsBoost,
  HorizontalLine,
} from './styles';

function Profile() {
  const { address } = useAuth();
  const contracts = useContractLoader();

  const debtBalance = useContractReader(contracts, 'NFTGame', 'balanceOf', [address, 0]);
  const points = debtBalance ? Number(formatUnits(debtBalance, 5)) : 0;

  const userdata = useContractReader(contracts, 'NFTGame', 'userdata', [address]);
  const climbingSpeedPerDay = userdata[1] ? Number(formatUnits(userdata[1], 5)) * 60 * 60 * 24 : 0;
  const climbingSpeedPerWeek = climbingSpeedPerDay * 7;

  const boost = 0; // in percent
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  console.count('Profile render');

  return (
    <BlackBoxContainer
      maxWidth={!isMobile && '340px'}
      p="40px 24px"
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      color="white"
      height="fit-content"
    >
      <ProfileDecoration left src={profileDecorationImage} />
      <ProfileDecoration right src={profileDecorationImage} />

      <Flex alignItems="center" justifyContent="center">
        <SectionTitle fontSize="24px" lineHeight="36px">
          GringoClimb69
        </SectionTitle>
        <Image src={editIcon} alt="edit username" marginLeft={2} />
      </Flex>

      <Flex flexDirection="column" alignItems="center" marginTop="36px">
        <Image src={crownImage} />
        <StatsPoints fontSize="40px" color="white" mt={2}>
          12
        </StatsPoints>
        <Label color="white" mt={1}>
          Position
        </Label>
      </Flex>

      <Flex justifyContent="center" mt="24px">
        <Flex flexDirection="column">
          <StatsPoints>{points.toLocaleString('en-US')}</StatsPoints>
          <Label textAlign="left" color="white" fontSize="14px">
            Points
          </Label>
        </Flex>
        <Flex flexDirection="column" ml="40px">
          <StatsBoost>{boost}%</StatsBoost>
          <Label textAlign="left" color="white" fontSize="14px">
            Boost
          </Label>
        </Flex>
      </Flex>
      {!isMobile && <HorizontalLine />}
      <BlackBoxContainer
        hasBlackContainer={isMobile}
        padding={isMobile && '24px'}
        mt={isMobile && '40px'}
      >
        <SectionTitle fontSize="24px">Climbing speed</SectionTitle>
        <Label fontSize="12px" color="white" textAlign="left" mt={1} mb={1} lineHeight="18px">
          The climbing speed is the lorem ipsum of the dolor sit amen.
        </Label>

        <ClimbingSpeedPer>
          <strong>{climbingSpeedPerWeek?.toLocaleString('en-US')}</strong> points per week
        </ClimbingSpeedPer>

        <ClimbingSpeedPer>
          <strong>{climbingSpeedPerDay?.toLocaleString('en-US')}</strong> points per day
        </ClimbingSpeedPer>
      </BlackBoxContainer>
    </BlackBoxContainer>
  );
}

export default Profile;
