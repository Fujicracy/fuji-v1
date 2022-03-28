import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { space } from 'styled-system';
import { mapToTheme } from 'styled-map';
import { themeGet } from '@styled-system/theme-get';

const MaxButton = styled(Button)`
  width: 260px;
  height: 44px;

  background: linear-gradient(287.45deg, rgba(0, 0, 0, 0) 6.81%, #000000 120.29%);
  border-radius: 6px;
  border: 2px solid black;
  font-size: 16px;

  color: white;

  &.active:enabled {
    box-shadow: ${mapToTheme('buttons.shadowActive')};
  }
  &:hover:enabled {
    opacity: 0.8;
    color: ${props => props.blackBackground && themeGet('colors.text05')};
  }
  ${space}
`;

export default MaxButton;
