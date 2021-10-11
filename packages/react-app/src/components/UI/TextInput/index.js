/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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
      autoComplete,
      value,
    },
    ref,
  ) => {
    const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
    const isTablet = useMediaQuery({
      minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
      maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
    });

    return (
      <Box mb={isMobile ? 4 : 4}>
        <SubTitleContainer>
          <label>{subTitle}</label>
          <SubTitleInfo>{subTitleInfo}</SubTitleInfo>
        </SubTitleContainer>
        <InputContainer>
          <AdornmentAvatar
            src={startAdornmentImage}
            alt={startAdornmentImage}
            width={isMobile ? '20px' : isTablet ? '28px' : '24px'}
            height={isMobile ? '20px' : isTablet ? '28px' : '24px'}
            marginRight={isMobile ? '8px' : '16px'}
          />
          <StyledInput
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value || '')}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            autoComplete={autoComplete || 'off'}
            fontSize={isMobile ? '12px' : isTablet ? '18px' : '14px'}
            ref={ref}
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
