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
import {
  ClimbingSpeedPer,
  ProfileDecoration,
  StatsPoints,
  StatsBoost,
  HorizontalLine,
  PseudoInput,
} from './styles';

function Profile() {
  const { address, networkId } = useAuth();

  const { points, climbingSpeedPerDay, climbingSpeedPerWeek, boost } = useProfileInfo();
  const formattedAddress = address ? address.substr(0, 6) + '...' + address.substr(-4, 4) : '';

  const roundedPoints = intToString(points);
  const roundedPerDay = intToString(climbingSpeedPerDay);
  const roundedPerWeek = intToString(climbingSpeedPerWeek);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  const [isEditable, setIsEditable] = useState(false);
  const [ranking, setRanking] = useState();
  const [customPseudo, setCustomPseudo] = useState(localStorage.getItem('customPseudo'));

  useEffect(
    () => (customPseudo ? localStorage.setItem('customPseudo', customPseudo) : undefined),
    [customPseudo],
  );

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
    >
      <ProfileDecoration left src={profileDecorationImage} />
      <ProfileDecoration right src={profileDecorationImage} />

      <Flex alignItems="center" justifyContent="center">
        {isEditable ? (
          <PseudoInput
            autoFocus
            onFocus={e => e.currentTarget.select()}
            value={customPseudo}
            onChange={e => {
              setCustomPseudo(e?.target?.value);
            }}
            onKeyUp={e => e.key === 'Enter' && setIsEditable(false)}
            onBlur={() => setIsEditable(false)}
          />
        ) : (
          <Flex height="54px" justifyContent="center" alignItems="center">
            <SectionTitle fontSize="24px" lineHeight="36px" onClick={() => setIsEditable(true)}>
              {customPseudo || formattedAddress}
            </SectionTitle>
            {/*
              <Image
                src={editIcon}
                alt="edit username"
                marginLeft={2}
                onClick={() => setIsEditable(true)}
                height="24px"
              />
              */}
          </Flex>
        )}
      </Flex>

      <Flex flexDirection="column" alignItems="center" marginTop="36px">
        <Image src={crownImage} />
        <StatsPoints fontSize="40px" color="white" mt={2}>
          {ranking?.position ?? '?'}
        </StatsPoints>
        <NavLink to="leaderboard" style={{ textDecoration: 'underline', color: 'white' }}>
          Position
        </NavLink>
      </Flex>

      <Flex justifyContent="center" mt="24px">
        <Flex flexDirection="column">
          <StatsPoints>{roundedPoints}</StatsPoints>
          <Label textAlign="left" color="white" fontSize="14px">
            Meter Points
          </Label>
        </Flex>
        <Flex flexDirection="column" ml="40px">
          <Flex alignItems="center">
            <StatsBoost>{boost ? `${boost}x` : '?'}</StatsBoost>
            <Tooltip>
              <InfoOutlined color="red" />
              <span>
                Each Climbing Gear NFT that you own boosts your meter points by an extra 10%.
                Duplicate NFTs will NOT count towards your final score, only one of each type is
                counted.
              </span>
            </Tooltip>
          </Flex>
          <Label textAlign="left" color="white" fontSize="14px">
            Boost Score
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
          Approximation based on your current borrowed amounts.
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
