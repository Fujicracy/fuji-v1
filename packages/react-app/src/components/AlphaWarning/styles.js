import styled from 'styled-components';
import { size, padding } from 'styled-system';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';

export const Container = styled(Box)`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  width: auto;
  background: linear-gradient(180deg, rgba(41, 41, 41, 0.64) 0%, var(--blocks) 100%);
  border-radius: 0.5rem;
  border: 1px solid;
  border-color: rgb(239, 1, 80);
  ${size}
  ${padding}
  ${fujiMedia.lessThan('medium')`
    
  `}
  ${fujiMedia.between('medium', 'large')`
    
  `}
`;
