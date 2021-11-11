import React from 'react';
import Lottie from 'react-lottie';

const Animation = ({ jsonAnimationData, isStopped, isPaused, width, height }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: jsonAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height={height}
      width={width}
      isStopped={isStopped}
      isPaused={isPaused}
    />
  );
};

export default Animation;
