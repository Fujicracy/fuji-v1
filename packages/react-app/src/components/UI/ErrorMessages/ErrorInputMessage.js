import styled from 'styled-components';
import { fontSize, space, width } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

const ErrorInputMessage = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin: 4px 8px;
  display: block;
  color: ${themeGet('colors.text100')};

  > span {
    color: ${themeGet('colors.brand')};
  }

  ${fontSize};
  ${space};
  ${width};

  ${fujiMedia.lessThan('small')`
    display: flex;
    align-items: center;
    font-size: 10px;
    display: block;
  `}
  ${fujiMedia.between('small', 'medium')`
    font-size: 14px;
  `}
`;
export default ErrorInputMessage;
