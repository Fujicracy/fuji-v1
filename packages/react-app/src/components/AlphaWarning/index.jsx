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
        This is an alpha version and contracts are not audited. Use at your own risk.
      </Typography>
    </Container>
  );
}

export default AlphaWarning;
