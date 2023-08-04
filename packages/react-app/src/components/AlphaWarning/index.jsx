import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Image, Box } from 'rebass';

import { flaskIcon } from 'assets/images';
import { Container } from './styles';

function AlphaWarning() {
  return (
    <Container>
      <Box mr="14px">
        <Image src={flaskIcon} alt="flask" width="35px" height="35px" />
      </Box>
      <Typography variant="body2">
        We released a newer version of the Fuji protocol and we are going to sunset the current one.
        Please, withdraw and migrate your liquidity from the V1 to{' '}
        <a href="https://app.fuji.finance" className="bold">
          Fuji V2 Himalaya
        </a>
        .
      </Typography>
    </Container>
  );
}

export default AlphaWarning;
