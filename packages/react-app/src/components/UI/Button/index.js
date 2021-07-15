import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { maxWidth, fontSize, space, typography } from 'styled-system';
import { mapToTheme } from 'styled-map';

const Button = styled(Box).attrs({
  as: 'button',
  type: 'button',
  px: 4,
  typography,
})`
  height: 40px;
  border-radius: ${props => (props.borderRadius ? `${props.borderRadius}px` : '4px')};
  position: relative;
  user-select: none;
  outline: none;
  box-shadow: none;
  display: inline-block;
  font-weight: bold;
  z-index: 0;
  color: ${mapToTheme('buttons.color')};
  border: ${props => (props.outline ? mapToTheme('buttons.border') : 'none')};
  background: ${props => (props.outline ? 'none' : mapToTheme('buttons.bg'))};
  transition: all ${themeGet('transitionTime')} ease;
  box-shadow: ${props => !props.outline && mapToTheme('buttons.shadow')};
  cursor: pointer;
  ${props =>
    props.block &&
    css`
      width: 100%;
    `}

  svg {
    position: absolute;
    left: 8px;
    top: 10px;
  }

  &:disabled {
    box-shadow: none;
  }

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

  ${fontSize}
  ${space}
  ${maxWidth}
`;

Button.defaultProps = {
  minWidth: 160,
  fontSize: 2,
  shadow: true,
};

Button.propTypes = {
  centered: PropTypes.bool,
  minWidth: PropTypes.number,
  shadow: PropTypes.bool,
};

Button.displayName = 'Button';

export default Button;
