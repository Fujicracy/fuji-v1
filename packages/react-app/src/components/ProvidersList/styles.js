import styled from 'styled-components';

import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

export const ProviderContainer = styled(Box).attrs(() => ({
  // bg: themeGet('colors.dark56')(props),
  bg: 'transparent',
}))`
  border-top: 0.063rem solid rgba(255, 255, 255, 0.05);
  padding: 14px 0px 14px 0px;
  margin: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${themeGet('colors.text64')};
`;

export const AssetContainer = styled(Box).attrs(() => ({
  // bg: themeGet('colors.dark56')(props),
  bg: 'transparent',
}))`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${themeGet('colors.text64')};
`;
