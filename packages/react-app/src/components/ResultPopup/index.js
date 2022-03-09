import React, { useState } from 'react';
import { Flex } from 'rebass';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS, BREAKPOINT_NAMES } from 'consts';
import { StyledModal, Label, Button } from '../UI';
import { EmotionImage, CloseContainer } from './styles';

const ResultPopup = ({ isOpen, onSubmit, onClose, content }) => {
  const [opacity, setOpacity] = useState(0);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber });
  const isTablet = useMediaQuery({
    minWidth: BREAKPOINTS[BREAKPOINT_NAMES.MOBILE].inNumber,
    maxWidth: BREAKPOINTS[BREAKPOINT_NAMES.TABLET].inNumber,
  });

  function toggleModal() {
    setOpacity(0);
    onSubmit(content.value);
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

  return (
    <StyledModal
      isOpen={isOpen}
      afterOpen={afterOpen}
      beforeClose={beforeClose}
      opacity={opacity}
      padding={0}
      blackShadow
    >
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%">
        <EmotionImage src={content.emotionIcon} />

        <Flex flexDirection="column" alignItems="center" padding="32px">
          <CloseContainer>
            <HighlightOffIcon color="primary" onClick={onClose} />
          </CloseContainer>

          <Label color="rgba(254, 52, 119, 1)" fontWeight="600" fontSize="24px" mt="24px">
            {content.title}
          </Label>
          <Label
            textAlign={isMobile ? 'center' : 'left'}
            mt={isMobile ? '24px' : 2}
            fontSize={isTablet ? 18 : 16}
            color="colors.text100"
            lineHeight={isMobile ? '150%' : '150%'}
            m="24px"
          >
            {content.description}
          </Label>

          <Button onClick={toggleModal} block borderRadius={4} height={48} fontSize={16}>
            {content.submitText}
          </Button>
        </Flex>
      </Flex>
    </StyledModal>
  );
};

export default ResultPopup;
