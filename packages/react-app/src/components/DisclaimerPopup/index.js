import React, { useState } from 'react';
import { Image, Flex } from 'rebass';
import Cookies from 'js-cookie';
import { flaskIcon } from 'assets/images';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { StyledModal, Label, Button, CheckBox, NavTextLink } from '../UI';
import { ContentContainer } from './styles';

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
    <StyledModal isOpen={isOpen} afterOpen={afterOpen} beforeClose={beforeClose} opacity={opacity}>
      <Flex flexDirection="column">
        <ContentContainer>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
            <Flex
              width={isMobile ? 1 : 1 / 3}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mb={isMobile ? '40px' : '0px'}
            >
              <Image
                src={flaskIcon}
                width={isMobile ? '80px' : '80px'}
                height={isMobile ? '80px' : '80px'}
              />
            </Flex>

            <Flex
              flexDirection="column"
              alignItems={isMobile ? 'center' : 'flex-start'}
              ml={isMobile ? 0 : 3}
            >
              <Label
                color="colors.text100"
                fontWeight="700"
                fontSize={isMobile ? 20 : isTablet ? 24 : 16}
              >
                Safety Notice
              </Label>
              <Label
                textAlign={isMobile ? 'center' : 'left'}
                mt={isMobile ? '24px' : 2}
                fontSize={isTablet ? 18 : 16}
                color="colors.text100"
                lineHeight={isMobile ? '150%' : '150%'}
              >
                Please be advised that the current version of the contracts isn&apos;t fully
                audited. Use at your own risk.
              </Label>
            </Flex>
          </Flex>
        </ContentContainer>

        <Flex
          flexDirection={isMobile || isTablet ? 'column' : 'row'}
          padding={isMobile ? '32px 28px 40px' : isTablet ? '32px 40px 40px' : '24px 0px 0px 0px'}
        >
          <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width={isMobile || isTablet ? 1 : 0.7}
            pr={isMobile || isTablet ? 0 : 3}
            mb={isMobile || isTablet ? '32px' : '0px'}
          >
            <Flex>
              <CheckBox
                checked={checked}
                onChange={handleCheckboxChange}
                descriptionFontSize={isTablet ? 16 : isMobile ? 14 : 12}
              />
              <Label
                textAlign={isMobile ? 'center' : 'left'}
                ml={3}
                fontSize={isTablet ? 16 : isMobile ? 14 : 12}
                lineHeight="130%"
                width={isTablet ? '280px' : undefined}
              >
                By moving forward, you accept our
                <br />
                <NavTextLink
                  url="https://docs.fujidao.org/legals/terms-of-use"
                  fontSize="14px"
                  marginRight="5px"
                  fontWeight="700"
                  color="white"
                >
                  Terms of Use
                </NavTextLink>
                and confirm that you understand the risks
              </Label>
            </Flex>
          </Flex>
          <Flex width={isMobile || isTablet ? 1 : 0.3} alignItems="center" justifyContent="center">
            <Button
              onClick={toggleModal}
              borderRadius={4}
              block={!isTablet}
              disabled={!checked}
              height={isTablet ? 48 : isMobile ? 40 : 33}
              width={150}
              fontSize={isTablet ? 16 : isMobile ? 14 : 12}
              blackBackground
            >
              Accept
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </StyledModal>
  );
};

export default DisclaimerPopup;
