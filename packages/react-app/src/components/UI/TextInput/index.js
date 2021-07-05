import React from 'react';
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

const TextField = React.forwardRef(
  (
    {
      name,
      placeholder,
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
      defaultValue,
      autoComplete,
    },
    ref,
  ) => {
    return (
      <Box mb={4}>
        <SubTitleContainer>
          <label>{subTitle}</label>
          <SubTitleInfo>{subTitleInfo}</SubTitleInfo>
        </SubTitleContainer>
        <InputContainer>
          <AdornmentAvatar src={startAdornmentImage} alt={startAdornmentImage} />
          <StyledInput
            name={name}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            ref={ref}
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
);

export default TextField;
