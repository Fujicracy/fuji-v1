import styled from 'styled-components';
import { size, background } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import PropTypes from 'prop-types';

const BlackBoxContainer = styled(Box).attrs(props => ({
  px: props.hasBlackContainer ? 4 : 0,
  bg: props.hasBlackContainer ? themeGet('colors.dark56')(props) : 'transparent',
}))`
  border: ${props => props.hasBlackContainer && `0.1rem solid ${themeGet('colors.text05')}`};
  backdrop-filter: ${props => props.hasBlackContainer && 'blur(0.375rem)'};
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 1rem;
  padding: ${props => (props.hasBlackContainer ? '2rem 1rem 2rem 1rem' : '0rem')};
  margin-top: 2rem;
  // z-index: ${props => (props.zIndex ? props.zIndex : '10')};
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

BlackBoxContainer.defaultProps = {
  hasBlackContainer: true,
};

BlackBoxContainer.propTypes = {
  hasBlackContainer: PropTypes.bool,
};

BlackBoxContainer.displayName = 'BlackBoxContainer';

export default BlackBoxContainer;
