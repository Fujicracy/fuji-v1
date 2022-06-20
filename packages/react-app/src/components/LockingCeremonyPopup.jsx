import React from 'react';
import { themeGet } from '@styled-system/theme-get';
import { color, padding } from 'styled-system';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import { fujiMedia } from 'consts';
import { Box, Button, Flex, Image } from 'rebass/styled-components';
import 'animate.css';

export const StyledModal = Modal.styled`
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
  font-size: 48px;
  line-height: 1.2em;
`;

// const Meta = styled.p`
//   color: #f5f5fd;
//   font-size: 14px;
//   line-height: 21px;

//   & > a {
//     color: #fe3477;
//     &:hover {
//       text-decoration: underline;
//     }
//   }
// `;

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;

  -webkit-mask-image: radial-gradient(
    circle 20px at calc(100% - 15px) 15px,
    transparent 20px,
    purple 0
  );
`;

const ImageBadge = styled.div`
  width: 43px;
  height: 43px;

  background-color: rgb(58, 58, 58);
  border-radius: 50%;
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 1;
`;

// const ImageNumber = styled.div`
//   width: 43px;
//   height: 43px;

//   font-size: 1.2rem;
//   font-weight: bold;

//   display: flex;
//   align-items: flex-start;
//   justify-content: center;

//   color: rgba(240, 1, 79, 1);
//   position: absolute;
//   right: -8px;
//   top: 4px;
//   z-index: 2;
// `;

// const TradeButton = styled(Button)`
//   margin: 16px 0;
//   background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
//   cursor: pointer;

//   &[disabled] {
//     cursor: not-allowed;
//     background: grey;
//   }

//   // TODO: Hover
// `;

const SectionBox = styled(Box)`
  margin: 8px 0;
`;

// const SectionTitle = styled.div`
//   font-size: 1.2rem;
//   margin-bottom: 8px;
//   & > span {
//     color: #05ff00;
//   }
// `;

const SectionDescription = styled.div`
  font-size: 0.8rem;
  line-height: 1rem;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  transition: opacity 0.3s;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const LockingCeremonyPopup = ({ isOpen, close }) => {
  return (
    <StyledModal isOpen={isOpen} onEscapeKeydown={close}>
      <CloseButton fontSize="medium" onClick={close} />
      <Flex flexWrap="wrap">
        <Box style={{ position: 'relative' }} scrolling="" maxWidth="500px">
          {/* <ImageNumber>{gear.balance}</ImageNumber> */}
          <ImageContainer>
            <ImageBadge />
            <picture>
              <source
                srcSet="https://purepng.com/public/uploads/medium/purepng.com-chuck-norrischuck-norrischucknorriscarlos-ray-norrisamerican-martial-artistactorproducerscreenwriter-1701528022114bxp46.png"
                type="image/png"
              />
              <Image
                src="https://purepng.com/public/uploads/medium/purepng.com-chuck-norrischuck-norrischucknorriscarlos-ray-norrisamerican-martial-artistactorproducerscreenwriter-1701528022114bxp46.png"
                height="auto"
                width="auto"
              />
            </picture>
          </ImageContainer>
        </Box>
        <Box p={4} flex="1">
          <Title>Disclaimer</Title>
          <SectionBox>
            <SectionDescription>
              This action is irreversible and by performing the ceremony you are officially ending
              your participation in Fuji’s 1st Climbing campaign.
            </SectionDescription>
            <SectionDescription>
              All your Climbing Gear NFTs will be thrown into the lava and dissappear from your
              wallet and in turn you will get a Memorabilia NFT with your metadata.
            </SectionDescription>
            {/* TODO: Check if we have input ready in our components */}
            <input type="checkbox" />
            <label>By clicking Confirm I assume responsibility of this action.</label>
            <PrimaryButton mt={4}>Confirm</PrimaryButton>
          </SectionBox>
        </Box>
      </Flex>
    </StyledModal>
  );
};

export default LockingCeremonyPopup;
