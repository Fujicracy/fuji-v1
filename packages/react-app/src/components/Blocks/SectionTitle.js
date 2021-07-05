import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

const SectionTitle = styled(Box).attrs(() => ({
  color: themeGet('colors.text'),
  mb: 4,
}))`
  font-size: 1rem;
  line-height: 120%;
  font-weight: 500;
  display: flex;
  align-items: center;
`;
export default SectionTitle;
