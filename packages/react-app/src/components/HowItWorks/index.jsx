import React from 'react';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import './styles.css';

function HowItWorks() {
  return (
    <fieldset className="hiw">
      <legend className="hiw-title">
        <span className="hiw-title-content">
          <span className="icon">
            <InfoOutlinedIcon />
          </span>
          <Typography variant="h3">How it works</Typography>
        </span>
      </legend>

      <Typography variant="body2">
        Reduce your crypto loan expenses with Fuji engine. The protocol constantly{' '}
        <span className="bold">scans</span> borrowing markets and automatically{' '}
        <span className="bold">refinances</span> its debt positions, providing its users with the
        most efficient APR available.
      </Typography>
    </fieldset>
  );
}

export default HowItWorks;
