import React, { useState, useEffect } from 'react';

import {
  PaginationContainer,
  CircleContainer,
  CircleOuter,
  CircleOption,
  CircleAnimation,
} from './styles';

const CirclePagination = ({ count, index, onDotClick }) => {
  const [previousIndex, setPreviousIndex] = useState(index || 0);
  const [timerHandle, setTimerHandle] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerHandle !== null) clearTimeout(timerHandle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      setTimerHandle(
        setTimeout(() => {
          setTimerHandle(null);
          setPreviousIndex(index);
        }, 200),
      );
    }
  }, [index, mounted]);

  const handleDotClick = (dotIndex, event) => {
    if (onDotClick) onDotClick(dotIndex, event);
  };

  return (
    <PaginationContainer height={16 * count}>
      <CircleContainer>
        {[...Array(count).keys()].map(i => (
          <CircleOuter key={i} top={i * 16} onClick={event => handleDotClick(i, event)}>
            <CircleOption
              elevation={0}
              opacity={
                i >= Math.min(previousIndex, index) && i <= Math.max(previousIndex, index) ? 0 : 0.5
              }
            />
          </CircleOuter>
        ))}
        <CircleAnimation
          elevation={0}
          top={Math.min(previousIndex, index) * 16 + 4}
          height={Math.abs(previousIndex - index) * 16 + 8}
        />
      </CircleContainer>
    </PaginationContainer>
  );
};

export default CirclePagination;
