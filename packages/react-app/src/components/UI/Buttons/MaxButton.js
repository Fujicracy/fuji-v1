import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { themeGet } from '@styled-system/theme-get';

const MaxButton = styled(Button)`
  padding: 0;
  height: 2rem;
  background-color: ${themeGet('colors.text05')};
  color: ${themeGet('colors.text32')};
  margin-right: 0.5rem;
  font-size: 0.875rem;
`;

export default MaxButton;
