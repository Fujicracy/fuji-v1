import React, { useState } from 'react';
import { map } from 'lodash';

import { SectionTitle, BlackBoxContainer } from 'components/Blocks';

const CustomList = ({ title, handleChange, options, defaultOption }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  console.log({ options, defaultOption, selectedOption });
  return (
    <BlackBoxContainer zIndex={1}>
      <div className="borrow-options">
        <SectionTitle fontSize={2} mb={4}>
          {title}
        </SectionTitle>
        <div className="select-options">
          <div className="options-list">
            {map(options, option => (
              <label key={`${title}-${option.id}`}>
                <input
                  type="radio"
                  name="borrow"
                  value={option.name}
                  onChange={() => {
                    setSelectedOption(option);
                    handleChange(option.name);
                  }}
                  checked={selectedOption.name === option.name}
                />
                <div className="fake-radio">
                  <img
                    alt={option.id}
                    src={option.icon}
                    style={{ width: '26px', height: '26px' }}
                  />
                  <span className="select-option-name">{option.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </BlackBoxContainer>
  );
};

export default CustomList;
