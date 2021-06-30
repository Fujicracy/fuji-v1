import styled from 'styled-components';
import { fontSize, space } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';

const Label = styled.p`
  color: ${props => (props.color ? themeGet(props.color) : themeGet('colors.text64'))};
  font-size: ${props => (props.fontSize ? `${themeGet(props.color)}px` : '14px')};
  text-align: center;
  ${fontSize}
  ${space}
`;
export default Label;
