import styled from 'styled-components';
import { size, padding, space } from 'styled-system';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';
import Paper from '@material-ui/core/Paper';
import { themeGet } from '@styled-system/theme-get';

export const Container = styled(Box)`
  height: 2.5rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 0.063rem solid var(--text32);
  background: var(--text05);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  position: relative;
  ${size}
  ${padding}
  ${space}
  ${fujiMedia.lessThan('small')`
    border-radius: 0.25rem;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 3.5rem;
    border-radius: 0.25rem;
  `}
`;

export const Option = styled(Box)`
  width: calc(50% - 4px);
  padding: 4px;
  left: 0.125rem;
  height: 2.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  border-radius: 0.5rem;

  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => (props.color ? props.color : themeGet('colors.text100'))};

  ${fujiMedia.lessThan('small')`
    border-radius: 0.25rem;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 3.125rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 600;
  `}
`;

export const ThumbAnimation = styled(Paper)`
  position: absolute;
  width: calc(50% - 4px);
  padding: 4px;
  left: 0.125rem;
  height: 2.125rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  line-height: 1;
  border-radius: 0.25rem;

  transition: 250ms ease all;
  background: var(--text32);
  left: ${props => (props.selected === 'left' ? `0.125rem` : `calc(50% + 2px)`)};

  ${fujiMedia.lessThan('small')`
    border-radius: 0.25rem;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: 3.125rem;
    border-radius: 0.25rem;
  `}
`;
