import styled from 'styled-components';
import { size } from 'styled-system';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';

export const Container = styled(Box)`
  position: relative;
  z-index: 2;
`;

export const HeaderContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => (props.isShowLogo ? 'space-between' : 'flex-end')};
  height: ${props => (props.height ? props.height : '100px')};

  padding: 0px 32px;

  ${size}

  ${fujiMedia.lessThan('small')`
    height:64px;
    padding: 16px 28px;
  `}
  ${fujiMedia.between('small', 'medium')`
    padding: 16px 40px;
    height: 88px;
  `}
`;

export const Logo = styled.img`
  height: 100%;
  transition: all 250ms ease;
  &:hover {
    opacity: 0.8;
  }
  ${size}
`;
