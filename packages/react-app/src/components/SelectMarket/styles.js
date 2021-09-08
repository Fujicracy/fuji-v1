import styled from 'styled-components';
import { Box } from 'rebass';
import media from 'styled-media-query';

export const RadioContainer = styled(Box).attrs({
  display: 'flex',
  flexDirection: 'row',
})`
  margin: 0;
  background-color: transparent;
`;

export const MarketButton = styled(Box)`
  display: flex;
  width: 100%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;

  font-weight: 600;

  background: ${props =>
    props.clicked
      ? 'linear-gradient(180deg, rgba(9, 9, 9, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(9, 9, 9, 0.5) 90%)'};
  border-radius: ${props => (props.left ? '8px 0 0 8px' : props.right ? '0 8px 8px 0' : '0')};
  border: 1px solid rgb(60, 60, 60);
  border-right: ${props => (props.left ? 'none' : '1px solid rgb(80, 80, 80)')};
  color: white;
  cursor: pointer;
  ${media.lessThan('medium')`
    border-radius: ${props => (props.left ? '4px 0 0 4px' : props.right ? '0 4px 4px 0' : '0')};
  `}

  ${media.between('medium', 'large')`
    border-radius: ${props => (props.left ? '4px 0 0 4px' : props.right ? '0 4px 4px 0' : '0')};
    height: 40px;
    font-size:16px;
  `}
`;
