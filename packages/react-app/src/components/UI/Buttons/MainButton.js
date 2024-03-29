import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { maxWidth, fontSize, space, typography } from 'styled-system';
import { mapToTheme } from 'styled-map';
import { fujiMedia } from 'consts';

const Button = styled(Box).attrs({
  as: 'button',
  type: 'button',
  px: 4,
  typography,
})`
  height: ${props =>
    props.height
      ? props.height === Number(props.height)
        ? `${props.height}px`
        : props.height
      : '40px'};

  width: ${props =>
    props.width
      ? props.width === Number(props.width)
        ? `${props.width}px`
        : props.width
      : '40px'};

  border-radius: ${props => (props.borderRadius ? `${props.borderRadius}px` : '0.5rem')};
  position: relative;
  user-select: none;
  outline: none;
  box-shadow: none;
  display: inline-block;
  font-size: 1rem;
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 'bold')};
  font-family: ${props => (props.fontFamily ? props.fontFamily : 'inherit')};
  z-index: 0;
  color: ${mapToTheme('buttons.color')};
  border: ${props =>
    props.border ? props.border : props.outline ? mapToTheme('buttons.border') : 'none'};
  background: ${props =>
    props.background ? props.background : props.outline ? 'none' : mapToTheme('buttons.bg')};
  transition: all ${themeGet('transitionTime')} ease;
  box-shadow: ${props => !props.outline && mapToTheme('buttons.shadow')};
  cursor: pointer;
  ${props =>
    props.block &&
    css`
      width: 100%;
    `}
  &:disabled {
    box-shadow: none;
    background: ${props => props.blackBackground && themeGet('colors.black')};
  }

  &:focus:enabled,
  &.active:enabled {
    box-shadow: ${mapToTheme('buttons.shadowActive')};
  }

  &:hover:enabled {
    opacity: 0.8;
  }

  &.active {
    background: ${mapToTheme('buttons.hover')};
  }

  ${fontSize}
  ${space}
  ${maxWidth}

  ${fujiMedia.lessThan('small')`
    height: ${props => !props.noResizeOnResponsive && '44px'};
    border-radius: 6px;
  `}
  ${fujiMedia.between('small', 'medium')`
    height: ${props => !props.noResizeOnResponsive && '56px'};
    font-size: ${props => !props.noResizeOnResponsive && '20px'};
    border-radius: 6px;
  `}
`;

Button.defaultProps = {
  minWidth: 160,
  fontSize: 3,
  shadow: true,
};

Button.propTypes = {
  centered: PropTypes.bool,
  minWidth: PropTypes.number,
  shadow: PropTypes.bool,
};

Button.displayName = 'Button';

export default Button;
