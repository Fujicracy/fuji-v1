import colors from './colors';
import buttons from './buttons';
import inputs from './inputs';
import links from './links';

import './styles/fonts.css';

import baseTheme from '../baseTheme';

const theme = {
  ...baseTheme,

  name: 'Main theme',

  colors,

  buttons,

  inputs,

  links,
};

export default theme;
