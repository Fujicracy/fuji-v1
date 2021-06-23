import { opacify } from 'polished';

import colors from './colors';

const HOVER_VALUE = 0.05;

export default {
  bg: {
    white: colors.white,
    secondary: colors.secondary,
    disabled: colors.black,
    default: colors.gradients.primary.toRight,
  },
  border: {
    white: colors.white,
    secondary: colors.secondary,
    disabled: colors.black,
    default: `2px solid ${colors.primary}`,
  },
  color: {
    white: colors.secondary,
    secondary: colors.white,
    disabled: colors.text16,
    default: colors.white,
  },
  colorHover: {
    white: colors.lightBlue,
    secondary: colors.white,
    disabled: colors.text16,
    default: colors.white,
  },
  shadow: {
    white: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
    secondary: '0 0 15px 0 rgba(0, 0, 0, 0.1)',
    default: `0px 0px 6px ${colors.primary}`,
  },
  shadowActive: {
    white: '0 0 15px 0 rgba(0, 0, 0, 0.05)',
    secondary: 'none',
    default: 'none',
  },
  hover: {
    white: opacify(HOVER_VALUE, colors.white),
    disabled: colors.text16,
    secondary: opacify(HOVER_VALUE, colors.secondaryHover),
    default: opacify(HOVER_VALUE, colors.primaryHover),
  },
};
