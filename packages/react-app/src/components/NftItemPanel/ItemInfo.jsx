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
  const rewards = Object.keys(outcomes[type]).sort((a, b) => parseFloat(a) - parseFloat(b));

  return (
    <div className="animate__animated animate__fast animate__flipInY">
      <p style={{ margin: '1rem 0' }}>Probability of outcomes:</p>
      <Table size="small">
        <TableBody>
          {rewards.map(reward => {
            const probabilty = outcomes[type][reward];

            return (
              <TableRow key={`${reward}${outcomes[type][reward]}`}>
                <TableCell style={{ color: 'inherit' }} padding={isMobile ? 'none' : 'normal'}>
                  <strong>{probabilty}</strong>
                </TableCell>
                <TableCell style={{ color: 'inherit' }} padding="none">
                  {reward !== 'card' ? (
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
    </div>
  );
};

export default ItemInfos;
