import styled from 'styled-components';
import { Box } from 'rebass';
import { BaseModalBackground } from 'styled-react-modal';

export const Container = styled(Box)`
  min-height: 100vh;
`;

export const FadingBackground = styled(BaseModalBackground)`
  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(5px);
  }
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.7);
  }
  transition: all 0.3s ease-in-out;
`;
