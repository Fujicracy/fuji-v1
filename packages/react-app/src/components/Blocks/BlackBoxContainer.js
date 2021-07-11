import styled from 'styled-components';
import { size, background } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';

const BlackBoxContainer = styled(Box).attrs(props => ({
  px: 4,
  bg: themeGet('colors.dark56')(props),
}))`
  border: 0.1rem solid ${themeGet('colors.text05')};
  backdrop-filter: blur(0.375rem);
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
  z-index: ${props => (props.zIndex ? props.zIndex : '10')};
  position: relative;

  ${size}
  ${background}

  .position-details {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.063rem solid ${themeGet('colors.text05')};
    padding: 0.5rem 0rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
`;

export default BlackBoxContainer;
