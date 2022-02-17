import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { space, width } from 'styled-system';

const SectionTitle = styled(Box)`
  line-height: ${props => (props.lineHeight ? props.lineHeight : '120%')};
  display: flex;
  align-items: center;
  color: ${props =>
    props.primary
      ? 'rgba(250, 38, 108, 1)'
      : props.color
      ? props.color
      : themeGet('colors.text100')};
  font-size: ${props => (props.fontSize ? props.fontSize : '16px')};
  justify-content: ${props => props.justifyContent && props.justifyContent};
  align-items: ${props => props.alignItems && props.alignItems};
  width: ${props => props.width && props.width};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 600)};
  text-align: ${props => props.textAlign && props.textAlign};
  font-family: ${props => (props.fontFamily ? props.fontFamily : 'inherit')};

  > span {
    margin-left: ${props => (props.spanMargin ? props.spanMargin : '4px')};
    color: ${props => (props.spanColor ? props.spanColor : themeGet('colors.pink'))};
    font-size: ${props => (props.spanFontSize ? props.spanFontSize : '16px')};
  }
  ${space}
  ${width}
`;

export default SectionTitle;
