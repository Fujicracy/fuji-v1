import React from 'react';
import { themeGet } from '@styled-system/theme-get';
import { color, padding } from 'styled-system';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import { fujiMedia } from 'consts';
import { Box, Flex, Image, Button } from 'rebass/styled-components';
import { useContractLoader } from 'hooks';
import EthAddress from '../EthAddress';
import 'animate.css';

export const StyledModal = Modal.styled`
  display: flex;
  position: relative;
  align-items: center;
  width: 50rem;
  height: 31.25rem;
  overflow-y: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  element::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }

  background: rgba(25, 25, 25, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;

  transition : all 0.3s ease-in-out;
  color: ${themeGet('colors.fujiWhite')};
  flex-direction: column;
  opacity: ${props => props.opacity};


  ${padding};
  ${color};
  
  ${fujiMedia.lessThan('small')`
    width: 100%;
    height: 100%;
    border-radius: 0px;
    justify-content: space-between;
  `};

  animation: backInDown;
  animation-duration: 0.8s;
  opacity: 1 !important; // Override animation opacity
`;

const CloseButton = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 1;
  &:hover {
    color: #fa266c;
  }
`;

const Title = styled.p`
  font-size: 48px;
  line-height: 72px;
`;

const Meta = styled.p`
  color: #f5f5fd;
  font-size: 14px;
  line-height: 21px;

  & > a {
    color: #fe3477;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ImageContainer = styled(Box)`
  position: relative;
  border: 2px solid rgb(58, 58, 58);
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(
    circle 20px at calc(100% - 15px) 15px,
    transparent 20px,
    purple 0
  );
  overflow: hidden;
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

const ImageNumber = styled.div`
  width: 43px;
  height: 43px;

  font-size: 1.2rem;
  font-weight: bold;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  color: rgba(240, 1, 79, 1);
  position: absolute;
  right: -8px;
  top: 4px;
  z-index: 2;
`;

const TradeButton = styled(Button)`
  margin: 16px 0;
  background: linear-gradient(92.29deg, #fe3477 0%, #f0014f 100%);
  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
    background: grey;
  }

  // TODO: Hover
`;

const SectionBox = styled(Box)`
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
`;

const Half = styled(Box)`
  position: relative;
  width: 50%;

  ${fujiMedia.lessThan('small')`
    width: 100%;
  `}
`;

const SectionTitle = styled.div`
  font-size: 1.2rem;
  margin-bottom: 8px;
  & > span {
    color: #05ff00;
  }
`;

const SectionDescription = styled.div`
  font-size: 0.8rem;
  line-height: 1rem;
`;

const GearPopup = ({ gear, close }) => {
  const contracts = useContractLoader();
  const contractAddress = contracts?.NFTGame.address;

  return (
    <StyledModal isOpen={Boolean(gear)} onEscapeKeydown={close}>
      <CloseButton fontSize="medium" onClick={close} />
      <Flex p={4} flexWrap="wrap">
        <Half>
          <ImageNumber>{gear.balance}</ImageNumber>
          <ImageContainer>
            <ImageBadge />
            <Image src={gear.images.medium} />
          </ImageContainer>
        </Half>
        <Half pl={4}>
          <Title>{gear.name}</Title>
          <Meta>
            Contract:{' '}
            <a
              href={`https://ftmscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <EthAddress address={contractAddress} />
            </a>
          </Meta>
          {/* TODO: Activate button */}
          <TradeButton type="button" disabled>
            Trade in marketplace
          </TradeButton>
          <SectionBox>
            <SectionTitle>
              Boost score
              <span> +{gear.boost}%</span>
            </SectionTitle>
            <SectionDescription>
              This means that your total Meter Points will be increased (1.{gear.boost}x). You can
              accumulate Boost when you possess multiple Climbing Gear NFTs.
            </SectionDescription>
          </SectionBox>
          <SectionBox>
            <SectionTitle>Description</SectionTitle>
            <SectionDescription>{gear.description}</SectionDescription>
          </SectionBox>
        </Half>
      </Flex>
    </StyledModal>
  );
};

export default GearPopup;
