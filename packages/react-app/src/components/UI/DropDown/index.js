import React, { useState, useEffect } from 'react';
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
} from './style';

const DropDown = ({ options, defaultOption, isSelectable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption === null && defaultOption?.title && Number(defaultOption?.rate || 0) !== 0) {
      setSelectedOption(defaultOption);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOption]);
  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option => option.title !== selectedOption?.title);
  return (
    <DropDownContainer>
      <DropDownHeader isOpened={isOpen} onClick={toggling}>
        <Box width={4 / 7}>{selectedOption?.title}</Box>
        <Box
          width={2 / 7}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          color={selectedOption?.title === defaultOption?.title && '#42FF00'}
        >
          <AnimatedCounter countTo={selectedOption?.rate} /> %
        </Box>
        <Box width={1 / 7} display="flex" alignItems="center" justifyContent="center">
          <Image src={isOpen ? closeIcon : plusIcon} width={12} height={12} />
        </Box>
      </DropDownHeader>
      <Collapse in={isOpen}>
        <DropDownListContainer open={isOpen} length={filteredOptions?.length}>
          <DropDownList>
            {filteredOptions?.map(option => (
              <ListItem
                onClick={isSelectable ? onOptionClicked(option) : undefined}
                key={Math.random()}
              >
                <Box width={4 / 7} cursor="pointer">
                  {option.title}
                </Box>
                <Box
                  width={3 / 7}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >{`${option.rate} %`}</Box>
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      </Collapse>
    </DropDownContainer>
  );
};

export default DropDown;
