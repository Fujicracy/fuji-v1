import React, { useState } from 'react';

import { Container, ThumbAnimation, Option } from './styles';

const ToggleSwitch = ({ firstOption, secondOption, onSwitch, ...rest }) => {
  const [selected, setSelected] = useState('left');
  return (
    <Container {...rest}>
      <Option
        onClick={() => {
          setSelected('left');
          onSwitch(0);
        }}
      >
        <span>{firstOption}</span>
      </Option>
      <Option
        onClick={() => {
          setSelected('right');
          onSwitch(1);
        }}
      >
        <span>{secondOption}</span>
      </Option>
      <ThumbAnimation selected={selected} />
    </Container>
  );
};

export default ToggleSwitch;
