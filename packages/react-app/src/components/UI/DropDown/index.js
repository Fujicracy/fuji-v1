import React, { useState } from 'react';
import { plusIcon, closeIcon } from 'assets/images';
import { Image, Box } from 'rebass';
import Collapse from '@material-ui/core/Collapse';
import AnimatedCounter from '../AnimatedCounter';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
} from './styles';

const DropDown = ({ options, defaultOption, width, onOptionClicked, isOptionSelectable }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option => option.title !== defaultOption?.title);

  const toggling = () => {
    if (filteredOptions.length > 0) setIsOpen(!isOpen);
  };

  return (
    <DropDownContainer width={width}>
      <DropDownHeader isOpened={isOpen} onClick={toggling} isSelectable={isOptionSelectable}>
        <Box width={defaultOption?.rate ? 4 / 7 : 6 / 7}>{defaultOption?.title}</Box>
        {defaultOption?.rate && (
          <Box
            width={2 / 7}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            color="#42FF00"
          >
            <AnimatedCounter countTo={defaultOption?.rate} /> %
          </Box>
        )}
        <Box width={1 / 7} display="flex" alignItems="center" justifyContent="flex-end" pr={1}>
          <Image src={isOpen ? closeIcon : plusIcon} width={12} height={12} />
        </Box>
      </DropDownHeader>
      <Collapse in={isOpen}>
        <DropDownListContainer
          isSelectable={isOptionSelectable}
          open={isOpen}
          length={filteredOptions?.length}
        >
          <DropDownList>
            {filteredOptions?.map(option => (
              <ListItem
                key={Math.random()}
                isSelectable={isOptionSelectable}
                onClick={() => {
                  toggling();
                  if (onOptionClicked) onOptionClicked(option);
                }}
              >
                <Box width={option.rate ? 4 / 7 : 1} cursor="pointer">
                  {option.title}
                </Box>
                {option.rate && (
                  <Box
                    width={3 / 7}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >{`${option.rate} %`}</Box>
                )}
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      </Collapse>
    </DropDownContainer>
  );
};

export default DropDown;
