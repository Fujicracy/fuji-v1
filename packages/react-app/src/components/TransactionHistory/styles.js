import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

export const GridItem = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
  cursor: pointer;
  ${fujiMedia.greaterThan('small')`
    cursor: inherit;
  `}
`;

export const LinkItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
  cursor: pointer;
  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;
