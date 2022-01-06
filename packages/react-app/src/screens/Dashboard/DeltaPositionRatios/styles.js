import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';
import ListItemText from '@material-ui/core/ListItemText';

export const CustomListItem = styled(ListItemText)`
  position: relative;
  color: ${themeGet('colors.text100')};

  > span > div {
    right: 0px;
  }
  ${fujiMedia.lessThan('small')`
    padding-left: 0px;
    margin-top: 12px;
    margin-bottom: 0px;
    p {
      color: ${themeGet('colors.text100')};
      font-size: 16px;
      text-align: right;
    }
  `}
  ${fujiMedia.between('small', 'medium')`
    
  `}
`;
