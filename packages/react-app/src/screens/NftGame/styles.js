import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Image } from 'rebass';
import { fujiMedia } from 'consts';
import { themeGet } from '@styled-system/theme-get';

export const DecorationImage = styled(Image)`
  position: absolute;
  right: 40px;

  ${fujiMedia.lessThan('small')`
    right: 20px;
  `}
`;

export const NavigationContainer = styled.ul`
  display: flex;
  justify-content: flex-start;
  padding: 8px;

  ${fujiMedia.lessThan('small')`
    justify-content: center;
  `}
`;

export const StyledNavLink = styled(NavLink)`
  margin: 0px 12px;
  padding: 4px;

  display: block;
  font-size: 14px;
  line-height: 21px;
  color: white;

  &.active {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid #e9024d;
    box-sizing: border-box;
    border-radius: 30px;
  }

  ${fujiMedia.greaterThan('small')`

    border-bottom: 4px solid white;
    &.active {
      background: transparent;
      border: none;
      border-bottom: 4px solid ${themeGet('colors.primary')};
      box-sizing: border-box;
      border-radius: 0px;
    }
  `}
`;
