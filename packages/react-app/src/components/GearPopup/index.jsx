import React from 'react';
import { themeGet } from '@styled-system/theme-get';
import { color, padding } from 'styled-system';
import CloseIcon from '@material-ui/icons/Close';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import { fujiMedia } from 'consts';
import { Box, Flex, Image, Button, Link } from 'rebass/styled-components';
import { useContractLoader } from 'hooks';
import EthAddress from '../EthAddress';
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
  margin: 8px 0;
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
  const boost = gear.balance ? gear.boost[gear.balance - 1] || gear[gear.boost.length - 1] : 0;

  return (
    <StyledModal isOpen={Boolean(gear)} onEscapeKeydown={close}>
      <CloseButton fontSize="medium" onClick={close} />
      <Flex flexWrap="wrap">
        <Box style={{ position: 'relative' }} scrolling="" maxWidth="500px">
          <ImageNumber>{gear.balance}</ImageNumber>
          <ImageContainer>
            <ImageBadge />
            <picture>
              <source srcSet={gear.images.medium.replace('.png', '.webp')} type="image/webp" />
              <Image src={gear.images.medium} height="auto" width="auto" />
            </picture>
          </ImageContainer>
        </Box>
        <Box p={4} flex="1">
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
          <SectionBox>
            <SectionDescription>{gear.description}</SectionDescription>
          </SectionBox>
          <Link
            href="https://paintswap.finance/marketplace/collections/0x14b35fbc82b3a3b95843062b96861ddbdeefaee0"
            color="#fa266c"
            target="_blank"
          >
            <TradeButton type="button">Marketplace</TradeButton>
          </Link>
          <SectionBox>
            <SectionTitle>
              Boost scores
              {boost ? <span> +{boost}%</span> : ''}
            </SectionTitle>
            <SectionDescription>
              As far as you possess this Climbing Gear NFT your Meter Points will be multiplied by:
              <ul>
                <li>- 1.10x for 1 Gear</li>
                <li>- 1.15x for 2 Gears</li>
                <li>- 1.17x for 3 Gears</li>
                <li>- 1.18x for 4 Gears or more...</li>
              </ul>
            </SectionDescription>
          </SectionBox>
        </Box>
      </Flex>
    </StyledModal>
  );
};

export default GearPopup;
