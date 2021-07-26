import React, { useState } from 'react';
import { Image, Flex } from 'rebass';
import Cookies from 'js-cookie';
import { flaskIcon } from 'assets/images';
import { StyledModal, Label, Button, CheckBox } from '../UI';
import { ContentContainer } from './style';

const DisclaimerPopup = ({ isOpen, onSubmit }) => {
  const [opacity, setOpacity] = useState(0);
  const [checked, setChecked] = useState(false);

  function toggleModal() {
    setOpacity(0);
    onSubmit(checked);
    Cookies.set('confirm_disclaim', checked);
  }

  function afterOpen() {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }

  function beforeClose() {
    return new Promise(resolve => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });
  }

  const handleCheckboxChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <StyledModal
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      opacity={opacity}
      backgroundProps="filter:blur(5px)"
    >
      <Flex flexDirection="column">
        <ContentContainer>
          <Flex flexDirection="row" alignItems="center">
            <Flex width={1 / 4}>
              <Image src={flaskIcon} width="60px" height="60px" />
            </Flex>

            <Flex flexDirection="column" alignItems="flex-start" ml={3}>
              <Label color="colors.text100" fontWeight="700" fontSize={16}>
                Safety Notice
              </Label>
              <Label textAlign="left" mt={2} fontSize={16} color="colors.text100">
                This is an alpha version, and contracts have not yet been audited.
              </Label>
            </Flex>
          </Flex>
        </ContentContainer>

        <Flex flexDirecion="row" mt={4} pl={4} pr={2}>
          <Flex width={2 / 3} pr={4}>
            <CheckBox
              checked={checked}
              onChange={handleCheckboxChange}
              description="I acknowledge the risks involved with current release."
            />
          </Flex>
          <Flex width={1 / 3} mr={2} alignItems="center">
            <Button onClick={toggleModal} borderRadius={55} block disabled={!checked} height={33}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </StyledModal>
  );
};

export default DisclaimerPopup;
