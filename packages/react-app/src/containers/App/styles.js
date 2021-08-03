import styled from 'styled-components';
import { Box } from 'rebass';
import { BaseModalBackground } from 'styled-react-modal';

export const Container = styled(Box)`
  min-height: 100vh;
`;

export const FadingBackground = styled(BaseModalBackground)`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease-in-out;
`;
