import styled from 'styled-components';
import { fontSize, space, width, textAlign, color, margin } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';

const Label = styled.p`
  cursor: pointer;
  padding: ${props => props?.padding};
  color: ${props => (props.color ? themeGet(props.color) : themeGet('colors.text64'))};
  font-size: ${props => (props.fontSize ? `${themeGet(props.fontSize)}px` : '14px')};
  text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : '400')};
  line-height: ${props => (props.lineHeight ? props.lineHeight : '100%')};
  ${fontSize};
  ${space};
  ${width};
  ${textAlign};
  ${color};
  ${margin};
`;
export default Label;
