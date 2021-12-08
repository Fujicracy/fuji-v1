import React from 'react';
import Lottie from 'react-lottie';
import { Flex } from 'rebass';

const Animation = ({
  jsonAnimationData,
  isStopped,
  isPaused,
  width,
  height,
  marginTop,
  onClick,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: jsonAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Flex marginTop={marginTop} style={{ cursor: 'pointer' }} onClick={onClick}>
      <Lottie
        options={defaultOptions}
        height={height}
        width={width}
        isStopped={isStopped}
        isPaused={isPaused}
      />
    </Flex>
  );
};

export default Animation;
