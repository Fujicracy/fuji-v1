import React from 'react';
import '@lottiefiles/lottie-player';

function Loader() {
  return (
    <lottie-player
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '56px',
        height: 'auto',
      }}
      src="/loader.json"
      speed="1"
      loop
      autoplay
    />
  );
}

export default Loader;
