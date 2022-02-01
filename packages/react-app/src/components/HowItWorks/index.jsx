import React from 'react';
import { Trans } from 'react-i18next';
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
        <Typography variant="h3">
          <Trans i18nKey="howItWorks.title">How it works</Trans>
        </Typography>
      </TitleContainer>

      <ContentContainer>
        <Trans i18nKey="howItWorks.description">
          With Fuji you reduce your loan expenses by <strong>~10%</strong>. The protocol constantly{' '}
          <strong>monitors</strong> borrow markets and automatically <strong>refinances</strong> its
          debt positions at the best available rates.
        </Trans>
      </ContentContainer>
    </Container>
  );
}

export default HowItWorks;
