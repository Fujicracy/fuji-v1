import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'rebass';

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
    placeholder,
    hasError,
    isTouched,
    startAdornmentImage,
    endAdornment,
    type,
    onChange,
    onFocus,
    onBlur,
    disabled,
    subTitle,
    description,
    subTitleInfo,
    errorComponent,
    inputRef,
    defaultValue,
    autoComplete,
  }) => {
    const error = isTouched && hasError;
    return (
      <Box mb={4}>
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
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            error={error}
            ref={inputRef}
            autoComplete={autoComplete || 'off'}
          />
          {endAdornment &&
            (endAdornment?.type === 'currency' ? (
              <AdornmentText>≈${endAdornment.text}</AdornmentText>
            ) : endAdornment?.type === 'percent' ? (
              <AdornmentText>{endAdornment.text}%</AdornmentText>
            ) : (
              endAdornment?.type === 'component' && endAdornment.component
            ))}
        </InputContainer>
        <Description>{description}</Description>
        {errorComponent}
      </Box>
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
