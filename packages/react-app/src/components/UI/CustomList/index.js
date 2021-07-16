import React, { useState } from 'react';
import { map } from 'lodash';
import { BlackBoxContainer, SectionTitle } from 'components/Blocks';
import { comingSoonIcon } from 'assets/images';

const CustomList = ({ title, handleChange, options, defaultOption, hasBlackContainer = true }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  return (
    <BlackBoxContainer hasBlackContainer={hasBlackContainer}>
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
                    handleChange(option);
                  }}
                  checked={selectedOption.name === option.name}
                  disabled={option.isComingSoon}
                />
                <div className="fake-radio">
                  <img
                    alt={option.id}
                    src={option.icon}
                    style={{ width: '26px', height: '26px' }}
                    disabled={option.isComingSoon}
                  />
                  <span className="select-option-name" disabled={option.isComingSoon}>
                    {option.name}
                  </span>
                  {option.isComingSoon && (
                    <img
                      alt="Soon"
                      src={comingSoonIcon}
                      style={{ opacity: 1, filter: 'grayscale(0%)' }}
                    />
                  )}
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
