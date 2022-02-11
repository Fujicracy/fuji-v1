import styled from 'styled-components';
import { Image } from 'rebass';
import { fujiMedia } from 'consts';

export const DecorationImage = styled(Image)`
  position: absolute;
  right: 40px;

  ${fujiMedia.lessThan('small')`
    right: 20px;
  `}
`;
