import React, { useState } from 'react';
import { plusIcon, closeIcon } from 'assets/images';
import { Image } from 'rebass';
import { useSpring, animated, config } from 'react-spring';
import Collapse from '@material-ui/core/Collapse';
import {
  DropDownContainer,
  DropDownHeader,
  DropDownListContainer,
  DropDownList,
  ListItem,
  TextBox,
} from './style';

function AnimatedCounter({ countTo }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: Number(countTo || 0),
    config: config.stiff,
  });

  return (
    <animated.span>
      {countTo
        ? number.to(n => {
            return n.toFixed(2);
          })
        : '...'}
    </animated.span>
  );
}

const DropDown = ({ options, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  const curOption = selectedOption || defaultOption;
  return (
    <DropDownContainer>
      <DropDownHeader isOpened={isOpen} onClick={toggling}>
        <TextBox width={4 / 7}>{curOption?.title}</TextBox>
        <TextBox
          width={2 / 7}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          color={(selectedOption?.title === defaultOption?.title || !selectedOption) && '#42FF00'}
        >
          <AnimatedCounter countTo={curOption?.rate} /> %
        </TextBox>
        <TextBox width={1 / 7} display="flex" alignItems="center" justifyContent="flex-end">
          <Image src={isOpen ? closeIcon : plusIcon} width={17} height={17} />
        </TextBox>
      </DropDownHeader>
      <Collapse in={isOpen}>
        <DropDownListContainer open={isOpen}>
          <DropDownList>
            {options?.map(option => (
              <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                <TextBox width={4 / 7} cursor="pointer">
                  {option.title}
                </TextBox>
                <TextBox
                  width={3 / 7}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >{`${option.rate} %`}</TextBox>
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      </Collapse>
    </DropDownContainer>
  );
};

export default DropDown;
