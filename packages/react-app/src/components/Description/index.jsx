import React from 'react';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { Container, TitleContainer, ContentContainer } from './styles';

const Description = ({ title, description, ...rest }) => {
  return (
    <Container {...rest}>
      <TitleContainer>
        <InfoOutlinedIcon
          style={{
            color: 'white',
            marginRight: '0.5rem',
            filter: 'drop-shadow(0px 0px 1px white)',
          }}
        />
        <Typography variant="h3">{title}</Typography>
      </TitleContainer>

      <ContentContainer>{description}</ContentContainer>
    </Container>
  );
};

export default Description;
