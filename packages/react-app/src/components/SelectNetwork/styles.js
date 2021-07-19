import styled from 'styled-components';
import { Box } from 'rebass';

export const RadioContainer = styled(Box).attrs({
  display: 'flex',
  flexDirection: 'row',
})`
  margin: 0;
  background-color: transparent;
`;

export const NetworkButton = styled(Box)`
  width: 100%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  text-shadow: ${props => (props.clicked ? '0px 0px 2px #ffffff' : 'none')};
  font-weight: 600;

  background: ${props =>
    props.clicked
      ? 'linear-gradient(180deg, rgba(9, 9, 9, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(9, 9, 9, 0.5) 90%)'};
  border-radius: ${props => (props.left ? '10px 0 0 10px' : props.right ? '0 10px 10px 0' : '0')};
  border: 1px solid
    ${props => (props.clicked ? ' rgba(255, 255, 255, 0.025)' : ' rgba(255, 255, 255, 0.1)')};
  color: ${props => (props.clicked ? 'white' : 'rgba(255, 255, 255, 0.3)')};
`;
