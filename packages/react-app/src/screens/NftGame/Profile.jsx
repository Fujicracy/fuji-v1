import React from 'react';
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
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

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
          <StatsPoints>23 459</StatsPoints>
          <Label textAlign="left" color="white" fontSize="14px">
            Points
          </Label>
        </Flex>
        <Flex flexDirection="column" ml="40px">
          <StatsBoost>60%</StatsBoost>
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
          <strong>87,843m</strong> per week
        </ClimbingSpeedPer>

        <ClimbingSpeedPer>
          <strong>12,549m</strong> per day
        </ClimbingSpeedPer>
      </BlackBoxContainer>
    </BlackBoxContainer>
  );
}

export default Profile;
