import React, { useEffect, useState } from 'react';
import { BlackBoxContainer, EthAddress, Label, Loader, Tooltip } from 'components';
import { useMediaQuery } from 'react-responsive';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import styled from 'styled-components';
import axios from 'axios';
import { Flex } from 'rebass';

import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_POINTS_DECIMALS, API_BASE_URI } from 'consts';
import { formatUnits } from 'ethers/lib/utils';
import { intToString } from 'helpers';
import { useAuth } from 'hooks';

const Cell = styled(TableCell)`
  color: white;
  border: none;
`;

const Body = styled(TableBody)`
  // background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  // box-shadow: 0px 0px 8px #f0014f;

  & > tr {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #303030 0.01%, #101010 100%);
    margin: 0.5rem;
  }
  & > tr:nth-child(1) {
    background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
    box-shadow: 0px 0px 8px #f0014f;
  }

  & > tr:nth-child(2) {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  }

  & > tr:nth-child(3) {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  }

  & tr.active {
    border: 3px solid #f0014f;
  }
`;

const HeadContainer = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  padding-bottom: 1rem;
`;

function Leaderboard() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAuth();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: allRanks } = await axios.get(`${API_BASE_URI}/rankings`, {
        params: { networkId: 2, limit: 25 },
      });

      if (!allRanks.find(r => r.address === address)) {
        try {
          const { data: userRank } = await axios.get(`${API_BASE_URI}/rankings/${address}`, {
            params: { networkId: 2 },
          });
          allRanks.push(userRank);
        } catch (e) {
          console.error(e);
        }
      }

      setRankings(allRanks);
      setIsLoading(false);
    }
    fetchData();
  }, [address]);

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <HeadContainer>
        <Flex alignItems="center">
          <Label color="white" fontSize={4} fontWeight={500} textAlign="left">
            Leaderboard
          </Label>
          <Tooltip>
            <InfoOutlined />
            <span>Updated every 2 hours.</span>
          </Tooltip>
        </Flex>
        <br />
        <Label color="white" fontSize={2} textAlign="left">
          Check here how you are standing next to the other fellow climbers.
        </Label>
      </HeadContainer>

      <Table>
        <TableHead>
          <TableRow>
            <Cell>Rank</Cell>
            <Cell>Address / Name</Cell>
            <Cell>Meter points</Cell>
            <Cell>Climbing speed</Cell>
          </TableRow>
        </TableHead>
        <Body>
          {!isLoading &&
            rankings.map(r => (
              <TableRow className={r.address === address ? 'active' : ''} key={r.address}>
                <Cell>
                  #{r.position}
                  {r.previousPosition && r.previousPosition > r.position && '⬆'}
                  {r.previousPosition && r.previousPosition < r.position && '⬇'}
                </Cell>
                <Cell>
                  <a
                    href={`https://ftmscan.com/address/${r.address}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'white', textDecoration: 'underline' }}
                  >
                    {r.username || <EthAddress address={r.address} prefix="10" suffix="8" />}
                  </a>
                </Cell>
                <Cell>{intToString(formatUnits(r.accruedPoints, NFT_GAME_POINTS_DECIMALS))}</Cell>
                <Cell>{parseInt(r.rateOfAccrual, 10)} m/day</Cell>
              </TableRow>
            ))}
        </Body>
      </Table>
      {isLoading && <Loader style={{ width: '56px', height: 'auto', margin: 'auto' }} />}
    </BlackBoxContainer>
  );
}

export default Leaderboard;
