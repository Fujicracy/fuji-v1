import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  InputContainer,
  SubTitleContainer,
  SubTitleInfo,
  Description,
  AdornmentAvatar,
  AdornmentText,
  StyledInput,
} from './styles';

const TextField = styled(
  ({
    id,
    name,
    value,
    placeholder,
    hasError,
    isTouched,
    startAdornmentImage,
    endAdornment,
    type,
    onChange,
    disabled,
    subTitle,
    description,
    subTitleInfo,
    errorComponent,
    inputRef,
  }) => {
    const error = isTouched && hasError;
    return (
      <>
        <SubTitleContainer>
          <label>{subTitle}</label>
          <SubTitleInfo>{subTitleInfo}</SubTitleInfo>
        </SubTitleContainer>
        <InputContainer>
          <AdornmentAvatar src={startAdornmentImage} alt={startAdornmentImage} />
          <StyledInput
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
            ref={inputRef}
          />
          {endAdornment.type === 'currency' ? (
            <AdornmentText>≈${endAdornment.text}</AdornmentText>
          ) : (
            <AdornmentText>{endAdornment.text}%</AdornmentText>
          )}
        </InputContainer>
        <Description>{description}</Description>
        {errorComponent}
      </>
    );
  },
)``;

TextField.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  hintText: PropTypes.string,
  id: PropTypes.string,
  inputRef: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

TextField.displayName = 'TextField';

export default TextField;
