import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { space } from 'styled-system';

const SectionTitle = styled(Box)`
  line-height: 120%;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${themeGet('colors.text100')};
  ${space}
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
`;

export default SectionTitle;
