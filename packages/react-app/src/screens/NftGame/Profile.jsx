/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Flex, Image } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { NavLink } from 'react-router-dom';

import { BREAKPOINTS, BREAKPOINT_NAMES, API_BASE_URI } from 'consts';
import { BlackBoxContainer, Label, SectionTitle, Tooltip } from 'components';
import { intToString } from 'helpers';

import { useProfileInfo, useAuth } from 'hooks';

import { crownImage, profileDecorationImage } from 'assets/images';
import PseudoInput from './PseudoInput';
import {
  ClimbingSpeedPer,
  ProfileDecoration,
  StatsPoints,
  StatsBoost,
  HorizontalLine,
} from './styles';

function Profile() {
  const { address, networkId } = useAuth();
  const { points, climbingSpeedPerDay, climbingSpeedPerWeek, boost } = useProfileInfo();

  const roundedPoints = intToString(points);
  const roundedPerDay = intToString(climbingSpeedPerDay);
  const roundedPerWeek = intToString(climbingSpeedPerWeek);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const [ranking, setRanking] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: userRank } = await axios.get(`${API_BASE_URI}/rankings/${address}`, {
          params: { networkId },
        });
        setRanking(userRank);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, [address, networkId]);

  return (
    <BlackBoxContainer
      maxWidth={!isMobile && '340px'}
      p={isMobile ? '0 24px 24px 24px' : '40px 24px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      color="white"
      height="fit-content"
      style={{ zIndex: 1 }}
    >
      <ProfileDecoration left src={profileDecorationImage} />
      <ProfileDecoration right src={profileDecorationImage} />

      <PseudoInput />

      <Flex flexDirection="column" alignItems="center" marginTop="36px">
        <Image src={crownImage} />
        <StatsPoints fontSize="40px" color="white" mt={2}>
          {ranking?.position ?? '?'}
        </StatsPoints>
        <NavLink to="leaderboard" style={{ textDecoration: 'underline', color: 'white' }}>
          Rank
        </NavLink>
      </Flex>

      <Flex justifyContent="center" mt="24px">
        <Flex flexDirection="column">
          <StatsPoints>{roundedPoints}</StatsPoints>
          <Label textAlign="left" color="white" fontSize="14px">
            Meter points
          </Label>
        </Flex>
        <Flex flexDirection="column" ml="40px">
          <Flex alignItems="center">
            <StatsBoost>{boost ? `${boost}x` : '?'}</StatsBoost>
            <Tooltip>
              <InfoOutlined />
              <span>
                Each Climbing Gear NFT that you own boosts your meter points by an extra 10%. Each
                duplicate NFTs gives a boost up to a maximum of 18%.
              </span>
            </Tooltip>
          </Flex>
          <Label textAlign="left" color="white" fontSize="14px">
            Boost
          </Label>
        </Flex>
      </Flex>
      {!isMobile && <HorizontalLine margin="40px 0px" />}
      <BlackBoxContainer
        hasBlackContainer={isMobile}
        padding={isMobile && '24px'}
        mt={isMobile && '40px'}
      >
        <SectionTitle fontSize="24px">Climbing speed</SectionTitle>
        <Label fontSize="12px" color="white" textAlign="left" mt={1} mb={1} lineHeight="18px">
          Based on your current borrowed amounts.
        </Label>

        <ClimbingSpeedPer>
          <strong>{roundedPerWeek}</strong> meter points per week
        </ClimbingSpeedPer>

        <ClimbingSpeedPer>
          <strong>{roundedPerDay}</strong> meter points per day
        </ClimbingSpeedPer>
      </BlackBoxContainer>
    </BlackBoxContainer>
  );
}

export default Profile;
