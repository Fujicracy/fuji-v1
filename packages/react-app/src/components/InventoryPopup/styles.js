import styled from 'styled-components';
import { size, color, space, width, height, padding } from 'styled-system';
import { Box, Image } from 'rebass';
import { fujiMedia } from 'consts';
import Modal from 'styled-react-modal';
import { themeGet } from '@styled-system/theme-get';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

export const ContentContainer = styled(Box)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 19px 6px 24px 19px;
  ${size};

  ${fujiMedia.lessThan('small')`
    padding: 40px 28px 32px;
  `}
  ${fujiMedia.between('small', 'medium')`
    padding: 40px 32px 40px;
  `}
`;

export const StyledModal = Modal.styled`
  display: flex;
  position: relative;
  align-items: center;
  width: 50rem;
  height: 31.25rem;
  border-radius: 12px;
  background-color: ${props => props.backgroundColor || 'white'};
  transition : all 0.3s ease-in-out;
  color: ${themeGet('colors.text64')};
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
  ${fujiMedia.between('small', 'medium')`
    
  `};

`;

export const OpacityImage = styled(Image)`
  position: absolute;
  opacity: 0.08;
  left: 0;
  top: 0;
  z-index: 0;
`;

export const CloseButton = styled(CloseOutlinedIcon)`
  position: absolute;
  right: 32px;
  top: 32px;
  width: 24px;
  height: 24px;

  cursor: pointer;
`;

export const GiftBoxPanel = styled(Image)`
  width: 200px;
  height: 200px;

  margin-top: 28px;

  mix-blend-mode: hard-light;

  ${space};
  ${height};
  ${width};
`;

export const IntroPanel = styled.video`
  border-radius: 12px;
  width: 200px;
  height: 200px;

  z-index: 1;
  ${space};
  ${height};
  ${width};
`;
