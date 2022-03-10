import styled from 'styled-components';
import { size } from 'styled-system';
import { Box, Image } from 'rebass';
import { fujiMedia } from 'consts';

export const ContentContainer = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 19px 6px 24px 19px;
  ${size};

  ${fujiMedia.lessThan('small')`
    padding: 40px 28px 32px;
  `}
  ${fujiMedia.between('small', 'medium')`
    padding: 40px 32px 40px;
  `}
`;

export const EmotionImage = styled(Image)`
  position: absolute;
  transform: translate(0, -50%);
`;

export const CloseContainer = styled(Box)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
`;
