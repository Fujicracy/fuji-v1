import React from 'react';
import Typography from '@material-ui/core/Typography';

import { flaskIcon } from 'assets/images';
import './styles.css';

function AlphaWarning() {
  return (
    <div className="alpha-warning">
      <div className="flask-icon">
        <img src={flaskIcon} alt="flask" />
      </div>
      <Typography variant="body2">
        This is an alpha version and contracts are not audited. Use at your own risk.
      </Typography>
    </div>
  );
}

export default AlphaWarning;
