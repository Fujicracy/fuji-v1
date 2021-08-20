import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { SunEffect } from './styles';

const BackgroundEffect = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  return <SunEffect isShow={!isMobile} />;
};
export default BackgroundEffect;
