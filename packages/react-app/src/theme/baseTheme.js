import { BREAKPOINT_NAMES } from './constants';

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: '480px',
  [BREAKPOINT_NAMES.TABLET]: '768px',
  [BREAKPOINT_NAMES.DESKTOP]: '991px',
  [BREAKPOINT_NAMES.LARGE]: '1439px',
};

const baseTheme = {
  name: 'Fuji main theme',

  breakpoints: Object.values(BREAKPOINTS),

  breakpointNames: BREAKPOINT_NAMES,

  //      0  1  2  3   4   5   6,  7
  space: [0, 4, 8, 16, 24, 32, 64, 128],

  //          0   1   2   3   4   5   6   7
  fontSizes: [10, 12, 14, 16, 20, 24, 28, 36],

  font: 'Poppins;',
  fontTitle: 'Poppins;',

  transitionTime: '.17s',
};

baseTheme.sizes = {
  sidebarWidth: {
    shrinked: `${baseTheme.space[5]}px`,
    default: '260px',
  },
  header: `${baseTheme.space[5]}px`,
};

export default baseTheme;
