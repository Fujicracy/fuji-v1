import styled from 'styled-components';

export const ChartContainer = styled.svg`
  -webkit-filter: ${props =>
    props.filterColor && `drop-shadow(0rem 0rem 0.25rem ${props.filterColor})`};
  filter: ${props => props.filterColor && `drop-shadow(0rem 0rem 0.25rem ${props.filterColor})`};
`;
