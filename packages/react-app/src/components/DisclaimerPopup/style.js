import styled from 'styled-components';
import { size } from 'styled-system';
import { Box } from 'rebass';
import media from 'styled-media-query';

export const ContentContainer = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 19px 6px 24px 19px;
  ${size};

  ${media.lessThan('medium')`
    padding: 40px 28px 32px;
  `}
  ${media.between('medium', 'large')`
    
  `}
`;
