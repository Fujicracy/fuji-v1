import { generateMedia } from 'styled-media-query';

export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: { inString: '600px', inNumber: 600 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '960px', inNumber: 960 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '1280px', inNumber: 1280 },
};

export const fujiMedia = generateMedia({
  small: '600px',
  medium: '960px',
  large: '1280px',
});

export const DESKTOP_MINIMUM_HEIGHT = 550;
