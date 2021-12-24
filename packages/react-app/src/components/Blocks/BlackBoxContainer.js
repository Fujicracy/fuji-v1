import styled from 'styled-components';
import { size, background } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import PropTypes from 'prop-types';
import { fujiMedia } from 'consts';

const BlackBoxContainer = styled(Box).attrs(props => ({
  // px: props.hasBlackContainer ? 4 : 0,
  bg: props.hasBlackContainer ? themeGet('colors.dark56')(props) : 'transparent',
}))`
  border: ${props => props.hasBlackContainer && `0.1rem solid rgba(255, 255, 255, 0.05)`};
  backdrop-filter: ${props => props.hasBlackContainer && 'blur(0.375rem)'};
  -webkit-backdrop-filter: blur(0.375rem);
  border-radius: 16px;
  margin-top: 2rem;
  position: relative;
  padding: ${props => (props.padding ? props.padding : '0px')};
  border-bottom-left-radius: ${props => props.noBottomBorderRadius && '0px'};
  border-bottom-right-radius: ${props => props.noBottomBorderRadius && '0px'};

  border-top-left-radius: ${props => props.noTopBorderRadius && '0px'};
  border-top-right-radius: ${props => props.noTopBorderRadius && '0px'};
  border-bottom: ${props => props.noBottomBorder && 'none'};
  ${size};
  ${background};
  .position-details {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.063rem solid ${themeGet('colors.text05')};
    padding: 0.5rem 0rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    &:first-child {
      padding: 24px 0px 8px;
    }
    &:last-child {
      padding: 0.5rem 0rem 0rem 0rem;
      margin-bottom: 0rem;
      margin-top: 0rem;
      border-bottom: none;
    }
  }

  ${fujiMedia.lessThan('small')`
    border-radius: 14px;
    border-top-left-radius: ${props => props.noTopBorderRadius && '0px'};
    border-top-right-radius: ${props => props.noTopBorderRadius && '0px'};
    border-bottom-left-radius: ${props => props.noBottomBorderRadius && '0px'};
    border-bottom-right-radius: ${props => props.noBottomBorderRadius && '0px'};
    .position-details {
      border-bottom: none;
    }
  `}

  ${fujiMedia.between('small', 'medium')`
    border-radius: 14px;
    border-top-left-radius: ${props => props.noTopBorderRadius && '0px'};
    border-top-right-radius: ${props => props.noTopBorderRadius && '0px'};
    border-bottom-left-radius: ${props => props.noBottomBorderRadius && '0px'};
    border-bottom-right-radius: ${props => props.noBottomBorderRadius && '0px'};
    .position-details {
      font-size: 18px;
      padding: 12px 0px;
    }
  `}
`;

BlackBoxContainer.defaultProps = {
  hasBlackContainer: true,
};

BlackBoxContainer.propTypes = {
  hasBlackContainer: PropTypes.bool,
};

BlackBoxContainer.displayName = 'BlackBoxContainer';

export default BlackBoxContainer;
