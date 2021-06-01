import { darken, lighten } from 'polished';

import colors from './colors';

export default {
  color: {
    light: colors.text32,
    default: colors.secondary,
  },
  hover: {
    light: darken(0.2, colors.text32),
    default: darken(0.2, colors.secondary),
  },
  active: {
    light: lighten(0.2, colors.text32),
    default: lighten(0.2, colors.secondary),
  },
};
