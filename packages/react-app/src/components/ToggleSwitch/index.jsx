import React, { useState } from 'react';

import { Container, ThumbAnimation, Option } from './styles';

const ToggleSwitch = ({ firstOption, secondOption, onSwitch, ...rest }) => {
  const [selected, setSelected] = useState('left');
  return (
    <Container {...rest}>
      <Option
        onClick={() => {
          setSelected('left');
          onSwitch(firstOption);
        }}
      >
        <span>{firstOption}</span>
      </Option>
      <Option
        onClick={() => {
          setSelected('right');
          onSwitch(secondOption);
        }}
      >
        <span>{secondOption}</span>
      </Option>
      <ThumbAnimation selected={selected} />
    </Container>
  );
};

export default ToggleSwitch;
