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
    const isTablet = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber });

    return (
      <Box mb={isMobile ? 2 : 4}>
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
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            ref={ref}
            autoComplete={autoComplete || 'off'}
            fontSize={isMobile ? '12px' : isTablet ? '18px' : '14px'}
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
