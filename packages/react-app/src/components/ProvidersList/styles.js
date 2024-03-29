import styled from 'styled-components';

import { themeGet } from '@styled-system/theme-get';
import { Box, Flex } from 'rebass';
import { fujiMedia } from 'consts';

export const ProviderContainer = styled(Box).attrs(() => ({
  bg: 'transparent',
}))`
  padding: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${themeGet('colors.text64')};
  cursor: pointer;
  padding-top: 32px;
  ${fujiMedia.lessThan('small')`
    height: 32px;
    padding-top: 0px;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 40px;
    padding-top: 8px;
  `}
`;

export const AssetContainer = styled(Box).attrs(() => ({
  bg: 'transparent',
}))`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: ${props => (props.hasBottomBorder ? 4 : 0)}px;
  border-bottom: ${props =>
    props.hasBottomBorder ? `0.063px solid rgba(255, 255, 255, 0.1)` : 'none'};
  color: ${themeGet('colors.text64')};
`;

export const BorderFlex = styled(Flex).attrs(() => ({
  bg: 'transparent',
}))`
  border-bottom: 1px solid ${themeGet('colors.text32')};
`;
