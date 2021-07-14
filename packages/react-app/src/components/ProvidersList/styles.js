import styled from 'styled-components';

import { themeGet } from '@styled-system/theme-get';
import { Box, Flex } from 'rebass';

export const ProviderContainer = styled(Box).attrs(() => ({
  // bg: themeGet('colors.dark56')(props),
  bg: 'transparent',
}))`
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
  padding-bottom: ${props => (props.hasBottomBorder ? 14 : 0)}px;
  border-bottom: ${props =>
    props.hasBottomBorder ? `0.063px solid rgba(255, 255, 255, 0.05)` : 'none'};
  color: ${themeGet('colors.text64')};
`;

export const BorderFlex = styled(Flex).attrs(() => ({
  // bg: themeGet('colors.dark56')(props),
  bg: 'transparent',
}))`
  border-bottom: 1px solid ${themeGet('colors.text32')};
`;
