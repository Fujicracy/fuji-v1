import styled from 'styled-components';

import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

export const ProviderContainer = styled(Box).attrs(props => ({
  px: 4,
  bg: themeGet('colors.dark56')(props),
}))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
