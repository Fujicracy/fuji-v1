import React from 'react';
import { Flex } from 'rebass';
import { CheckboxContainer, HiddenCheckbox, StyledCheckbox, Icon } from './styles';

const CheckBox = ({ className, checked, description, descriptionFontSize, ...props }) => (
  <Flex flexDirection="row" alignItems="center" color="white">
    <label>
      <CheckboxContainer className={className}>
        <HiddenCheckbox checked={checked} {...props} />
        <StyledCheckbox checked={checked}>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
      </CheckboxContainer>
    </label>

    <span style={{ marginLeft: 8, fontSize: descriptionFontSize }}>{description}</span>
  </Flex>
);

export default CheckBox;
