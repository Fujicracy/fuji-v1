import React, { useState } from 'react';
import { themeGet } from '@styled-system/theme-get';
import { color, padding } from 'styled-system';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Transactor } from 'helpers';
import { fujiMedia } from 'consts';
import { Box, Button, Flex, Image, Text } from 'rebass/styled-components';
import 'animate.css';
import { lavaImage } from 'assets/images';
import { useAuth, useContractLoader } from 'hooks';
import { Label, CheckBox } from './UI';

const StyledModal = Modal.styled`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 50rem;
  height: 31.25rem;
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;

  animation: zoomIn;
  animation-duration: 0.6s;
  transition : all 0.3s ease-in-out;
  color: ${themeGet('colors.fujiWhite')};

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background: rgba(0, 0, 0, 0.5);
  }
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: rgba(0, 0, 0, 0.6);
  }


  ${padding};
  ${color};
  
  ${fujiMedia.lessThan('small')`
    width: 100%;
    height: 100%;
    border-radius: 0px;
    justify-content: space-between;
    overflow-y: auto;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    element::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  `};
`;

const CloseButton = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1;
  &:hover {
    color: #fa266c;
  }

  ${fujiMedia.lessThan('small')`
    left: 1rem;
    position: fixed;
  `}
`;

const Title = styled.p`
  font-size: 2.5rem;
  line-height: 1.2em;
`;

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;
`;

const SectionBox = styled(Box)`
  margin: 8px 0;
`;

const SectionDescription = styled(Text)`
  font-size: 1rem;
  line-height: 1.2rem;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  transition: opacity 0.3s;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &[disabled] {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

const LockingCeremonyPopup = ({ isOpen, close, onSuccess }) => {
  const { provider } = useAuth();
  const tx = Transactor(provider);
  const contracts = useContractLoader();
  const [isChecked, setIsChecked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  async function lessgo() {
    setIsFetching(true);
    try {
      const txRes = await tx(contracts.NFTInteractions.lockFinalScore());
      await txRes.wait();
      onSuccess();
      setIsFetching(false);
    } catch (e) {
      // Todo: handle error
      console.error(e);
      setIsFetching(false);
    }
  }

  return (
    <StyledModal isOpen={isOpen} onEscapeKeydown={close}>
      <CloseButton fontSize="medium" onClick={close} />
      <Flex flexWrap="wrap">
        <Box style={{ position: 'relative' }} scrolling="" maxWidth="450px" width={[1, 0.5]}>
          <ImageContainer>
            <Image src={lavaImage} height="auto" width="auto" />
          </ImageContainer>
        </Box>
        <Box p={4} flex="1">
          <Title>Disclaimer</Title>
          <SectionBox>
            <SectionDescription>
              This action is irreversible and by performing the ceremony you are officially ending
              your participation in Fuji’s 1st Climbing campaign.
            </SectionDescription>
            <SectionDescription mt={3}>
              All your Climbing Gear NFTs will be thrown into the lava and dissappear from your
              wallet and in turn you will get a Memorabilia NFT with your metadata.
            </SectionDescription>

            <Flex mt={4}>
              <CheckBox
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                descriptionFontSize={14}
              />
              <Label
                onClick={() => setIsChecked(!isChecked)}
                textAlign="left"
                lineHeight="1.2rem"
                padding="0 0 0 0.5rem"
              >
                By clicking Confirm I assume responsibility of this action.
              </Label>
            </Flex>
            <PrimaryButton
              mt={2}
              display="block"
              disabled={isFetching || !isChecked}
              onClick={lessgo}
            >
              {isFetching && (
                <CircularProgress size={14} style={{ marginRight: '8px', color: 'white' }} />
              )}
              Confirm
            </PrimaryButton>
          </SectionBox>
        </Box>
      </Flex>
    </StyledModal>
  );
};

LockingCeremonyPopup.prototype = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default LockingCeremonyPopup;
