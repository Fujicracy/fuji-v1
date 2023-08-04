import React from 'react';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { Container, TitleContainer, ContentContainer } from './styles';

function HowItWorks() {
  return (
    <Container>
      <TitleContainer>
        <InfoOutlinedIcon
          style={{
            color: 'white',
            marginRight: '0.5rem',
            filter: 'drop-shadow(0px 0px 1px white)',
          }}
        />
        <Typography variant="h3">WARNING !!!</Typography>
      </TitleContainer>

      <ContentContainer>
        We released a newer version of the Fuji protocol and we are going to sunset the current one.
        Please, withdraw and migrate your liquidity from the V1 to{' '}
        <a href="https://app.fuji.finance" className="bold">
          Fuji V2 Himalaya
        </a>
        .
      </ContentContainer>
    </Container>
  );
}

export default HowItWorks;
