import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { useCratesInfo } from 'hooks';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { intToString } from 'helpers';

const ItemInfos = ({ type }) => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const { outcomes } = useCratesInfo();
  const keys = Object.keys(outcomes[type])
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .filter(k => outcomes[type][k] !== 0);

  return (
    <>
      <p style={{ margin: '1rem 0' }}>Probability of outcomes:</p>
      <Table size="small">
        <TableBody>
          {keys.map(k => {
            const reward = outcomes[type][k];

            return (
              <TableRow key={`${k}${outcomes[type][k]}`}>
                <TableCell style={{ color: 'inherit' }} padding={isMobile ? 'none' : 'normal'}>
                  <strong>{k}</strong>
                </TableCell>
                <TableCell style={{ color: 'inherit' }} padding="none">
                  {typeof reward === 'number' ? (
                    <>
                      <strong>{intToString(reward)}</strong> points
                    </>
                  ) : (
                    'Gear NFT'
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ItemInfos;
