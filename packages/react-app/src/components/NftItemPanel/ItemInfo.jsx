import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { useCratesInfo } from 'hooks';

const ItemInfos = ({ type }) => {
  const { outcomes } = useCratesInfo();
  const keys = Object.keys(outcomes[type]).sort((a, b) => parseFloat(b) - parseFloat(a));

  return (
    <>
      {/* <p>Probabilities for {type?.toLowerCase()}:</p> */}
      <p style={{ margin: '1rem 0' }}>What&apos;s inside ?</p>
      <Table size="small">
        <TableBody>
          {keys.map(k => {
            const reward = outcomes[type][k];
            if (reward === 0) {
              return <></>;
            }

            return (
              <TableRow>
                <TableCell style={{ color: 'inherit' }}>
                  <strong>{k}</strong>
                </TableCell>
                <TableCell style={{ color: 'inherit' }}>
                  {typeof reward === 'number' ? (
                    <>
                      <strong>{reward}</strong> points
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
