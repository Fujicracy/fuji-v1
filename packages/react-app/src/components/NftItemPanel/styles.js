import styled from 'styled-components';
import { space, color, padding, width } from 'styled-system';
import { Image, Flex } from 'rebass';
import { INVENTORY_TYPE, fujiMedia } from 'consts';

export const Container = styled.div`
  border: none;
  position: relative;

  width: ${props => (props.mode === 'inventory' ? '172px' : '100%')};
  height: ${props => (props.mode === 'inventory' ? '256px' : '360')};

  box-sizing: border-box;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor || 'white'};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;

  cursor: ${props => (props.mode === 'inventory' ? 'pointer' : 'inherit')};

  ${color};
  ${padding};
  z-index: 1;
`;

export const LegendaryContainer = styled.div`
  border: none;
  position: relative;

  width: ${props => (props.mode === 'inventory' ? '172px' : '100%')};
  height: ${props => (props.mode === 'inventory' ? '256px' : '360px')};
  box-sizing: border-box;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor || 'white'};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;

  cursor: ${props => (props.mode === 'inventory' ? 'pointer' : 'inherit')};

  ${fujiMedia.lessThan('small')`
    justify-content: space-between;
    height: 250px;
  `}
  ${color};
  ${padding};
`;

export const ItemPanel = styled.div`
  width: 124px;
  height: 132px;

  background-color: rgb(32, 32, 32);
  border-radius: 8px;
  margin-top: 16px;

  ${fujiMedia.lessThan('small')`
    position: ${props => props.mode === INVENTORY_TYPE.LEGENDARY && 'absolute'};
    right:  ${props => props.mode === INVENTORY_TYPE.LEGENDARY && '24px'};
  `}
  ${space}
`;

export const CountButton = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${props => props.backgroundColor || 'rgba(255, 255, 255, 0.16)'};

  cursor: pointer;

  ${space}
`;

export const BuyButton = styled.div`
  width: 100px;
  height: 30px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  border-radius: 30px;
  background: ${props => props.backgroundColor || 'rgba(255, 255, 255, 0.16)'};

  cursor: pointer;

  ${space};
  ${width};
`;

export const OpacityImage = styled(Image)`
  position: absolute;
  opacity: 0.15;
  height: 100% !important;
  left: 0;
  top: 0;
`;

export const MarkContainer = styled.div`
  backdrop-filter: blur(8px);

  width: 100% !important;
  height: 100% !important;
  border: 3px solid
    ${props =>
      props.type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  box-sizing: border-box;
  border-radius: 8px;
`;

export const FujiMark = styled.div`
  position: absolute;
  padding: 0 5px;
  right: ${props => props.right && '-43px'};
  bottom: ${props => props.right && '90px'};

  left: ${props => props.left && '-43px'};
  top: ${props => props.left && '90px'};

  font-family: Sofia Pro;
  font-style: italic;
  font-weight: 900;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-align: center;

  color: ${props =>
    props.type === INVENTORY_TYPE.COMMON ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};

  backdrop-filter: blur(8px);
  transform: rotate(-90deg);

  z-index: 3;
`;

export const LegendaryItemsContainter = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;

  ${fujiMedia.lessThan('small')`
    width: 100%;
    margin-top: 12px !important;
    align-items: flex-start;
  `}
`;
