import { darken, lighten } from 'polished';

const palette = {
  pink: '#f0014f',
  lightPink: '#fe3477',
  green: '#17cb49',
  white: '#ffffff',
  black: '#101010',
  dark: '#191919',
  grey: '#292929',
  text64: 'rgba(255, 255, 255, 0.64)',
  text32: 'rgba(255, 255, 255, 0.32)',
  text16: 'rgba(255, 255, 255, 0.16)',
  text05: 'rgba(255, 255, 255, 0.05)',
  black64: 'rgba(16, 16, 16, 0.64)',
  dark64: 'rgba(25, 25, 25, 0.64)',
  dark56: 'rgba(25, 25, 25, 0.56)',
  blackOpacity: 'rgba(0, 0, 0, 0.5)',
};

const colors = {
  clear: 'rgba(255, 255, 255, 0)',
  clearFromBlack: 'rgba(0, 0, 0, 0)',

  bg: palette.black,

  // Colors
  primary: palette.pink,
  secondary: palette.black,
  success: palette.green,

  ...palette,
};

colors.whiteHover = darken(0.05, colors.white);
colors.whiteActive = darken(0.1, colors.white);

colors.primaryHover = lighten(0.14, colors.primary);
colors.primaryActive = lighten(0.24, colors.primary);

colors.secondaryHover = lighten(0.14, colors.secondary);
colors.secondaryActive = lighten(0.24, colors.secondary);

// Fonts
colors.text = {
  primary: colors.white,
  secondary: palette.text64,
  link: colors.text32,
  disabled: darken(0.1, palette.text32),
};

colors.gradients = {
  white: {
    toLeft: `linear-gradient(to left, ${colors.white}, ${colors.clear})`,
    toRight: `linear-gradient(to right, ${colors.white}, ${colors.clear})`,
    toTop: `linear-gradient(to top, ${colors.white}, ${colors.clear})`,
    toBottom: `linear-gradient(to bottom, ${colors.white}, ${colors.clear})`,
  },
  primary: {
    toLeft: `linear-gradient(to left, ${colors.lightPink}, ${colors.pink})`,
    toRight: `linear-gradient(to right, ${colors.lightPink}, ${colors.pink})`,
    toTop: `linear-gradient(to top, ${colors.lightPink}, ${colors.pink})`,
    toBottom: `linear-gradient(to bottom, ${colors.lightPink}, ${colors.pink})`,
  },
  dark: {
    toLeft: `linear-gradient(to left, ${colors.dark}, ${colors.grey})`,
    toRight: `linear-gradient(to right, ${colors.dark}, ${colors.grey})`,
    toTop: `linear-gradient(to top, ${colors.dark}, ${colors.grey})`,
    toBottom: `linear-gradient(to bottom, ${colors.dark}, ${colors.grey})`,
  },
};

export default colors;
