import React from 'react';
import { BlackBoxContainer, Label } from 'components';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import styled from 'styled-components';

const rankings = [
  {
    rank: 1,
    previousRank: 2,
    name: 'tiagofneto',
    address: '0x',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 2,
    previousRank: 1,
    name: 'Jaibo',
    address: '0x',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 3,
    previousRank: undefined,
    name: 'Yome',
    address: '0x',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 4,
    previousRank: undefined,
    name: 'bob40',
    address: '0x',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 5,
    previousRank: undefined,
    name: 'GringoClimb69',
    address: '0x5246EaDEa6925eF6A861e3e2860665306a8A6233',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 6,
    previousRank: undefined,
    name: '',
    address: '0x5246EaDEa6925eF6A861e3e286qw665306a8A6233',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
  {
    rank: 7,
    previousRank: undefined,
    name: '',
    address: '0x5246EaDEa6925eF6A861e3e2860665306a8A6244',
    points: 23459,
    boost: 60,
    speed: 87843,
  },
];

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

function Leaderboard() {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

  return (
    <BlackBoxContainer
      width="860px"
      p={isMobile ? '24px' : '40px'}
      hasBlackContainer={!isMobile}
      borderRadius="8px"
      mb="88px"
    >
      <Label color="white" fontSize={4} fontWeight={500} textAlign="left">
        Leaderboard
      </Label>
      <Label color="white" fontSize={2} textAlign="left">
        See your position around all the fam of fujidoers and climb to the summit of the world
      </Label>

      <Table>
        <TableHead>
          <TableRow>
            <Cell>Rank</Cell>
            <Cell>Address / Name</Cell>
            <Cell>Meter points</Cell>
            <Cell>Boost score</Cell>
            <Cell>Climbing speed</Cell>
          </TableRow>
        </TableHead>
        <Body>
          {rankings.map(r => (
            // TODO: Use current user address
            <TableRow
              className={{ active: r.address === '0x5246EaDEa6925eF6A861e3e2860665306a8A6233' }}
            >
              <Cell>
                #{r.rank}
                {r.previousRank && r.previousRank > r.rank ? '⬆' : '⬇'}
              </Cell>
              <Cell>{r.name ?? r.address}</Cell>
              <Cell>{r.points}</Cell>
              <Cell>{r.boost}%</Cell>
              <Cell>{r.speed} m/week</Cell>
            </TableRow>
          ))}
        </Body>
      </Table>
    </BlackBoxContainer>
  );
}

export default Leaderboard;
