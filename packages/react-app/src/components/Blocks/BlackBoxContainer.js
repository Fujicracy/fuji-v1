import styled from 'styled-components';
import { size, background, borderRadius, color, height } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import PropTypes from 'prop-types';
import { fujiMedia } from 'consts';

const BlackBoxContainer = styled(Box).attrs(props => ({
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
  ${borderRadius};
  ${color};
  ${height};

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
