import React from 'react';
import { Box } from 'rebass';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';

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
    const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });

    return (
      <Box mb={isMobile ? 3 : 4}>
        <SubTitleContainer>
          <label>{subTitle}</label>
          <SubTitleInfo>{subTitleInfo}</SubTitleInfo>
        </SubTitleContainer>
        <InputContainer>
          <AdornmentAvatar
            src={startAdornmentImage}
            alt={startAdornmentImage}
            width={isMobile && '20px'}
            height={isMobile && '20px'}
            marginRight={isMobile && '8px'}
          />
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
            fontSize={isMobile && '12px'}
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
