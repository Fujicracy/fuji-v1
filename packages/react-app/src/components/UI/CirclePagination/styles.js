import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import Paper from '@material-ui/core/Paper';

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 50px;
  top: 50%;
  z-index: 9999;
  height: ${props => (props.height ? `${props.height}px` : '100px')};
`;

export const CircleContainer = styled.div`
  position: relative;
  padding: 20px 0 28px;
`;

export const CircleOuter = styled.div`
  width: 8px;
  height: 8px;
  padding: 4px;
  float: left;
  position: absolute;
  top: ${props => `${props.top}px`};
  cursor: inherit;
  &:hover {
    cursor: pointer;
  }
`;

export const CircleOption = styled(Paper)`
  width: 8px;
  height: 8px;
  background: white;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;

  opacity: ${props => props.opacity};

  &:hover {
    background: ${themeGet('colors.primary')};
  }
`;

export const CircleAnimation = styled(Paper)`
  width: 8px;
  height: 8px;
  background: rgba(240, 1, 79, 1);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  position: absolute;
  margin-left: 4px;
  top: ${props => `${props.top}px`};
  height: ${props => `${props.height}px`};
`;
