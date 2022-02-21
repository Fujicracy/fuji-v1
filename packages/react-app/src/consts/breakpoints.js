import { generateMedia } from 'styled-media-query';

export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const BREAKPOINTS = {
  [BREAKPOINT_NAMES.MOBILE]: { inString: '767px', inNumber: 767 },
  [BREAKPOINT_NAMES.TABLET]: { inString: '1439px', inNumber: 1439 },
  [BREAKPOINT_NAMES.DESKTOP]: { inString: '1919px', inNumber: 1919 },
};

export const fujiMedia = generateMedia({
  small: '767px',
  medium: '1439px',
  large: '1919px',
});

export const DESKTOP_MINIMUM_HEIGHT = 550;
