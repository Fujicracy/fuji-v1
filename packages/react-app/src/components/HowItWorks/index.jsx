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
        <Typography variant="h3">How it works</Typography>
      </TitleContainer>

      <ContentContainer>
        With Fuji you reduce your loan expenses by <span className="bold">~10%</span>. The protocol
        constantly <span className="bold">monitors</span> borrow markets and automatically{' '}
        <span className="bold">refinances</span> its debt positions at the best available rates.
      </ContentContainer>
    </Container>
  );
}

export default HowItWorks;
