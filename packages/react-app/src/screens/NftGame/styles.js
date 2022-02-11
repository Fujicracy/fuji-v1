import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Image } from 'rebass';
import { fujiMedia } from 'consts';

export const DecorationImage = styled(Image)`
  position: absolute;
  right: 40px;

  ${fujiMedia.lessThan('small')`
    right: 20px;
  `}
`;

export const Flex = styled.ul`
  display: flex;
  justify-content: center;
  padding: 8px;
`;

export const StyledNavLink = styled(NavLink)`
  padding: 8px 24px;

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
`;
