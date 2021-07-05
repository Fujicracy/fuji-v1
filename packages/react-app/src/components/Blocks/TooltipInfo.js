import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

const TooltipInfo = styled(Box).attrs(props => ({
  color: themeGet('colors.text32')(props),
}))`
  margin-left: 0.5rem;
  display: flex;
  cursor: pointer;
  position: relative;
`;

export default TooltipInfo;
