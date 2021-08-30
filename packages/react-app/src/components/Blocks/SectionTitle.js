import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { space, width } from 'styled-system';

const SectionTitle = styled(Box)`
  line-height: 120%;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${themeGet('colors.text100')};
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
  justify-content: ${props => props.justifyContent && props.justifyContent};
  align-items: ${props => props.alignItems && props.alignItems};
  width: ${props => props.width && props.width};
  // font-weight: ${props => (props.fontBold ? 1000 : 700)};
  ${space}
  ${width}
`;

export default SectionTitle;
