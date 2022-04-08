/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { size, color, space, width, height, padding } from 'styled-system';
import { Box, Image } from 'rebass';
import { fujiMedia } from 'consts';
import Modal from 'styled-react-modal';
import { themeGet } from '@styled-system/theme-get';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export const CarouselContainer = styled(Carousel)`
  width: 80%;
  height: 100%;
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

export const ItemContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 12px;
  border: 1px solid black;

  margin: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.backgroundColor};
`;

export const RoundedAmountContainer = styled.div`
  position: absolute;
  width: ${props => props.width || '40px'};
  height: ${props => props.height || '40px'};

  display: flex;
  justify-content: center;
  align-items: center;
  top: 4px;
  right: 4px;
  border-radius: 50%;
  border: 1px solid black;
`;

export const CloseButton = styled(CloseOutlinedIcon)`
  position: absolute;
  right: 32px;
  top: 32px;
  width: 24px;
  height: 24px;

  cursor: pointer;
`;
