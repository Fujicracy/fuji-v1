import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { space, width } from 'styled-system';

const SectionTitle = styled(Box)`
  line-height: 120%;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${props => (props.color ? props.color : themeGet('colors.text100'))};
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
  justify-content: ${props => props.justifyContent && props.justifyContent};
  align-items: ${props => props.alignItems && props.alignItems};
  width: ${props => props.width && props.width};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 600)};
  text-align: ${props => props.textAlign && props.textAlign};
  span {
    margin-left: 4px;
    color: ${props => (props.spanColor ? props.spanColor : themeGet('colors.pink'))};
  }
  ${space}
  ${width}
`;

export default SectionTitle;
