import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { SunEffect } from './styles';

const BackgroundEffect = () => {
  const isDesktop = useMediaQuery({ minWidth: BREAKPOINTS[BREAKPOINT_NAMES.DESKTOP].inNumber });
  console.log({ isDesktop });
  return <SunEffect isShow={isDesktop} />;
};
export default BackgroundEffect;
