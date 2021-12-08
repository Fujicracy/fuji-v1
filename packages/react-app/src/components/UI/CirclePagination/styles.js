import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { fujiMedia } from 'consts';

export const CircleContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 50px;
  top: 50%;
  z-index: 9999;

  ${fujiMedia.lessThan('large')`
    justify-content: space-between;
  `}
`;

export const CircleOption = styled.div`
  height: 12px;
  width: 12px;
  background-color: ${props => (props.selected ? themeGet('colors.primary') : 'black')};
  border-radius: 50%;
  border: 2px solid white;
  margin: 8px;
  cursor: pointer;

  &:hover {
    border-color: ${themeGet('colors.primary')};
  }
`;
