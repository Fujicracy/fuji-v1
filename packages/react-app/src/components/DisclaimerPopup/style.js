import styled from 'styled-components';
import { size } from 'styled-system';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';

export const ContentContainer = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 19px 6px 24px 19px;
  ${size};

  ${fujiMedia.lessThan('medium')`
    padding: 40px 28px 32px;
  `}
  ${fujiMedia.between('medium', 'large')`
    
  `}
`;
