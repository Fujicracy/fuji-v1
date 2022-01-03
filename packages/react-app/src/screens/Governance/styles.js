import styled from 'styled-components';
import { Box } from 'rebass';
import { mapToTheme } from 'styled-map';

export const NftButton = styled(Box).attrs({
  as: 'button',
  type: 'button',
  px: 4,
})`
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 600;
  font-size: 16px;
  color: #f5f5fd;

  cursor: pointer;

  height: 44px;
  width: 100%;

  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  border-radius: 6px;
  &:focus:enabled,
  &:active:enabled {
    outline: none;
    box-shadow: ${mapToTheme('buttons.shadowActive')};
  }

  &:hover:enabled {
    opacity: 0.8;
  }

  &:active:enabled {
    background: ${mapToTheme('buttons.hover')};
  }
`;
