import styled from 'styled-components';
import { Box } from 'rebass';
import { BaseModalBackground } from 'styled-react-modal';
import { themeGet } from '@styled-system/theme-get';
import media from 'styled-media-query';

export const Container = styled(Box)`
  min-height: 100vh;
`;

export const FadingBackground = styled(BaseModalBackground)`
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease-in-out;
  ${media.lessThan('medium')`
    background-color: rgba(255, 255, 255, 0.05);
  `}
`;

export const NavText = styled.div`
  margin-right: 10px;
  font-size: 12px;

  color: ${themeGet('colors.text64')};

  &:hover {
    color: ${themeGet('colors.primary')};
  }
`;
