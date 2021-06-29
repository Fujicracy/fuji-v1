import styled from 'styled-components';
import { size, background } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

const BlackBoxContainer = styled(Box).attrs(props => ({
  px: 4,
  bg: themeGet('colors.dark56')(props),
}))`
  border: 0.1rem solid var(--text05);
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;

  ${size}
  ${background}
`;

export default BlackBoxContainer;
