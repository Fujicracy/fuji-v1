import React, { useState } from 'react';
import { Image, Flex } from 'rebass';
import Cookies from 'js-cookie';
import { flaskIcon } from 'assets/images';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { StyledModal, Label, Button, CheckBox } from '../UI';
import { ContentContainer } from './style';

const DisclaimerPopup = ({ isOpen, onSubmit }) => {
  const [opacity, setOpacity] = useState(0);
  const [checked, setChecked] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  function toggleModal() {
    setOpacity(0);
    onSubmit(checked);
    Cookies.set('confirm_disclaim', checked);
  }

  function afterOpen() {
    setTimeout(() => {
      setOpacity(0.9);
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
          <Flex flexDirection={isMobile || isTablet ? 'column' : 'row'} alignItems="center">
            <Flex
              width={isMobile ? 1 : 1 / 4}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mb={isMobile ? '40px' : '0px'}
            >
              <Image
                src={flaskIcon}
                width={isMobile ? '80px' : '60px'}
                height={isMobile ? '80px' : '60px'}
              />
            </Flex>

            <Flex
              flexDirection="column"
              alignItems={isMobile ? 'center' : 'flex-start'}
              ml={isMobile ? 0 : 3}
            >
              <Label color="colors.text100" fontWeight="700" fontSize={isMobile ? 20 : 16}>
                Safety Notice
              </Label>
              <Label
                textAlign={isMobile ? 'center' : 'left'}
                mt={isMobile ? '24px' : 2}
                fontSize={16}
                color="colors.text100"
                lineHeight={isMobile ? '150%' : '100%'}
              >
                This is an alpha version, and contracts have not yet been audited.
              </Label>
            </Flex>
          </Flex>
        </ContentContainer>

        <Flex
          flexDirection={isMobile ? 'column' : 'row'}
          padding={isMobile ? '32px 28px 40px' : '24px 8px 0px 16px'}
        >
          <Flex width={isMobile ? 1 : 2 / 3} pr={isMobile ? 0 : 4} mb={isMobile ? '32px' : '0px'}>
            <CheckBox
              checked={checked}
              onChange={handleCheckboxChange}
              descriptionFontSize={isMobile ? 14 : 12}
              description="I acknowledge the risks involved with current release."
            />
          </Flex>
          <Flex width={isMobile ? 1 : 1 / 3} mr={2} alignItems="center">
            <Button
              onClick={toggleModal}
              borderRadius={isMobile ? 4 : 55}
              block
              disabled={!checked}
              height={isMobile ? 40 : 33}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </StyledModal>
  );
};

export default DisclaimerPopup;
