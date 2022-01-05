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
} from './style';

const DropDown = ({ options, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option => option.title !== defaultOption?.title);

  const toggling = () => {
    if (filteredOptions.length > 0) setIsOpen(!isOpen);
  };

  return (
    <DropDownContainer>
      <DropDownHeader isOpened={isOpen} onClick={toggling}>
        <Box width={4 / 7}>{defaultOption?.title}</Box>
        <Box
          width={2 / 7}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          color="#42FF00"
        >
          <AnimatedCounter countTo={defaultOption?.rate} /> %
        </Box>
        <Box width={1 / 7} display="flex" alignItems="center" justifyContent="flex-end" pr={1}>
          <Image src={isOpen ? closeIcon : plusIcon} width={12} height={12} />
        </Box>
      </DropDownHeader>
      <Collapse in={isOpen}>
        <DropDownListContainer open={isOpen} length={filteredOptions?.length}>
          <DropDownList>
            {filteredOptions?.map(option => (
              <ListItem key={Math.random()}>
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
