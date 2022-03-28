import styled from 'styled-components';
import { space } from 'styled-system';

const CountButton = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${props => props.backgroundColor || 'rgba(255, 255, 255, 0.16)'};

  cursor: pointer;

  &:hover {
    border: ${props => !props.disabled && `1px solid ${props.foreColor}`};
  }

  &:active {
    background: ${props => !props.disabled && props.foreColor};
    color: ${props => !props.disabled && props.activeColor};
  }

  ${space}
`;

export default CountButton;
