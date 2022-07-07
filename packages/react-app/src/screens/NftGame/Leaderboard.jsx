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
import { Box, Flex } from 'rebass';

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
  const [error, setError] = useState();
  const { address, networkId } = useAuth();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError();
      try {
        const { data: allRanks } = await axios.get(`${API_BASE_URI}/rankings`, {
          params: { networkId, limit: 25 },
        });
        if (!allRanks.find(r => r.address === address)) {
          const { data: userRank } = await axios.get(`${API_BASE_URI}/rankings/${address}`, {
            params: { networkId },
          });
          allRanks.push(userRank);
        }
        const SECS = 60 * 60 * 24;
        const ranks = allRanks.map(r => ({
          ...r,
          address: r.address.toLowerCase(),
          rateOfAccrual:
            Number(formatUnits(parseInt(r.rateOfAccrual, 10), NFT_GAME_POINTS_DECIMALS)) * SECS,
        }));

        setIsLoading(false);
        setRankings(ranks);
      } catch (e) {
        setIsLoading(false);
        setError(e);
      }
    }
    if (networkId && address) fetchData();
  }, [address, networkId]);

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
            <span>Updated every 10 minutes.</span>
          </Tooltip>
        </Flex>
        <br />
        <Label color="white" fontSize={2} textAlign="left">
          Check here how you are standing next to the other fellow climbers.
        </Label>
      </HeadContainer>

      {error ? (
        <Box p={2} color="white" border="1px solid red">
          Oops, the leaderboard is unavailable 🥲 Please come back later and report this on our
          discord.
        </Box>
      ) : (
        <>
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
                        {r.username || (
                          <EthAddress address={r?.address ?? null} prefix="10" suffix="8" />
                        )}
                      </a>
                    </Cell>
                    <Cell>
                      {intToString(
                        formatUnits(r.accruedPoints.toString(), NFT_GAME_POINTS_DECIMALS),
                      )}
                    </Cell>
                    <Cell>{intToString(parseInt(r.rateOfAccrual, 10))}/day</Cell>
                  </TableRow>
                ))}
            </Body>
          </Table>
          {isLoading && <Loader style={{ width: '56px', height: 'auto', margin: 'auto' }} />}
        </>
      )}
    </BlackBoxContainer>
  );
}

export default Leaderboard;
