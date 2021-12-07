import React from 'react';
// import { Flex } from 'rebass';
import { CircleContainer, CircleOption } from './styles';

const CirclePagination = ({ totalCount, currentIndex, onHandleClick }) => {
  const pages = Array.from(Array(totalCount).keys());
  return (
    <CircleContainer>
      {pages.map(index => (
        <CircleOption
          key={index}
          selected={index === currentIndex}
          onClick={() => onHandleClick(index)}
        />
      ))}
    </CircleContainer>
  );
};

export default CirclePagination;
