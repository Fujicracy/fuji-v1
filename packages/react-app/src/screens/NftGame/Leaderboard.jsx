import React, { useEffect, useState } from 'react';
import { BlackBoxContainer, Label, Loader } from 'components';
import { useMediaQuery } from 'react-responsive';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import styled from 'styled-components';
import Axios from 'axios';

import { BREAKPOINTS, BREAKPOINT_NAMES, NFT_GAME_POINTS_DECIMALS } from 'consts';
import { formatUnits } from 'ethers/lib/utils';
import { intToString } from 'helpers';

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
  console.count('Leaderboard');

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const baseUri = 'https://fuji-api-dot-fuji-306908.ey.r.appspot.com';
      const res = await Axios.get(`${baseUri}/rankings`, { params: { networkId: 2 } });
      const newRankings = res.data.slice(0, 25);
      setRankings(newRankings);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <HeadContainer>
        <Label color="white" fontSize={4} fontWeight={500} textAlign="left">
          Leaderboard
        </Label>
        <br />
        <Label color="white" fontSize={2} textAlign="left">
          See your position around all the fam of fujidoers and climb to the summit of the world
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
          {rankings.map(r => (
            // TODO: Use current user address
            <TableRow
              className={{ active: r.address === '0x5246EaDEa6925eF6A861e3e2860665306a8A6233' }}
              key={r.address}
            >
              <Cell>
                #{r.position}
                {r.previousPosition && r.previousPosition > r.position ? '⬆' : '⬇'}
              </Cell>
              <Cell>
                <a
                  href={`https://ftmscan.com/address/${r.address}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'white', textDecoration: 'underline' }}
                >
                  {r.username || `${r.address.substr(0, 8)}...${r.address.substr(-8, 8)}`}
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
