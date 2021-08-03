import React from 'react';
import { useSpring, animated, config } from 'react-spring';

function AnimatedCounter({ countTo }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: Number(countTo || 0),
    config: config.stiff,
  });

  return (
    <animated.span>
      {countTo
        ? number.to(n => {
            return n.toFixed(2);
          })
        : '...'}
    </animated.span>
  );
}

export default AnimatedCounter;
