import styled from 'styled-components';
import { space, color, padding, width, height, opacity } from 'styled-system';
import { Image, Flex } from 'rebass';
import { CRATE_TYPE, fujiMedia } from 'consts';
import { inventoryBadge } from 'assets/images';
import InfoIcon from '@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel';

export const Container = styled.div`
  border: none;
  position: relative;
  overflow: hidden;

  width: ${props => (props.mode === 'inventory' ? '172px' : '100%')};
  height: ${props => (props.mode === 'inventory' ? '256px' : '360px')};

  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid ${props => props.backgroundColor || 'white'};
  background-color: ${props => props.backgroundColor || 'white'};

  display: ${props => (props.mode === 'info' ? 'block' : 'flex')};
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: center;
  padding: 24px;

  background-image: url('${props => props.backgroundImage}');
  background-size: contain;
  background-position: center;

  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  cursor: ${props => (props.mode === 'inventory' ? 'pointer' : 'inherit')};

  ${fujiMedia.lessThan('small')`
    padding: 16px;
    height: 240px;
  `}

  ${color};
  ${padding};
  ${opacity};
`;

export const LegendaryContainer = styled.div`
  border: none;
  position: relative;

  width: ${props => (props.mode === 'inventory' ? '172px' : '100%')};
  height: ${props => (props.mode === 'inventory' ? '256px' : '360px')};
  box-sizing: border-box;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor || 'white'};
  border: 1px solid ${props => props.backgroundColor || 'white'};

  background-image: url('${props => props.backgroundImage}');
  background-size: contain;
  background-position: center;

  display: ${props => (props.mode === 'info' ? 'block' : 'flex')};
  flex-direction: column;
  justify-content: ${props => props.justifyContent || 'center'};
  align-items: center;
  padding: 24px;

  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  cursor: ${props => (props.mode === 'inventory' ? 'pointer' : 'inherit')};

  ${fujiMedia.lessThan('small')`
    justify-content: space-between;
    height: 160px;
    padding: 16px;
  `}
  ${color};
  ${padding};
`;

export const PanelContainer = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.backgroundColor};
  mix-blend-mode: normal;
  border-radius: 50%;
  filter: blur(10px);

  display: relative;
`;

export const ItemPanel = styled(Image)`
  position: ${props => props.mode === 'inventory' && 'absolute'};
  width: 140px;
  height: 140px;

  border-radius: 8px;
  margin-top: 16px;

  z-index: 0;
  ${fujiMedia.lessThan('small')`
    position: ${props => props.mode === CRATE_TYPE.LEGENDARY && 'absolute'};
    right:  ${props => props.mode === CRATE_TYPE.LEGENDARY && '24px'};
    margin-top: ${props => (props.mode === CRATE_TYPE.LEGENDARY ? '0px' : '16px')};

    width: 80px;
    height: 80px;
  `};

  ${space};
  ${height};
  ${width};
`;

export const BuyButton = styled.div`
  width: 100%;
  height: 32px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-weight: 500;
  border-radius: 30px;
  background: ${({ theme }) => theme.buttonColor || 'rgba(255, 255, 255, 0.16)'};
  color: ${({ theme }) => theme.foreColor};
  cursor: pointer;
  border: 1px solid ${props => props.theme.backColor || props.activeColor};

  &:hover {
    border: ${props => !props.disabled && `1px solid ${props.theme.foreColor}`};
  }

  &[disabled] {
    cursor: not-allowed;
    color: ${({ theme }) => theme.disabledForeColor};
  }

  &:not([disabled]):active {
    background: ${({ theme }) => theme.foreColor};
    color: ${({ theme }) => theme.activeColor};
  }

  ${space};
  ${width};
`;

export const InfoButton = styled(InfoIcon)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;
export const CancelButton = styled(CancelIcon)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
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

  margin: 18px;
  position: absolute;

  width: calc(100% - 36px);
  height: calc(100% - 36px);
  border: 3px solid
    ${props =>
      props.type === CRATE_TYPE.COMMON ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  box-sizing: border-box;
  border-radius: 8px;
`;

export const BlackOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: #000000;
  mix-blend-mode: normal;
  border-radius: 8px;

  position: absolute;
  ${opacity};
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
    props.type === CRATE_TYPE.COMMON ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};

  transform: rotate(-90deg);

  background-color: ${props => props.backgroundColor};

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: transparent;
    backdrop-filter: blur(8px);
  }
`;

export const ItemsContainer = styled(Flex)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const LegendaryItemsContainer = styled(ItemsContainer)`
  ${fujiMedia.lessThan('small')`
    align-items: flex-start;
  `}
`;

export const Badge = styled.div`
  display: flex;
  justify-content: center;

  font-weight: bold;
  font-size: 14px;
  line-height: 21px;
  padding-top: 12px;

  position: absolute;
  right: ${props => props.position === 'right' && '8px'};
  left: ${props => props.position === 'left' && '8px'};
  top: 0px;
  width: 28px;
  height: 42px;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  background: url(${inventoryBadge}) no-repeat top center;
`;

export const StackedInventoryContainer = styled.div`
  margin-left: ${props => (props.overlay ? -150 : 0)}px;

  background: black;
  mix-blend-mode: normal;
  border-radius: 8px;
  ${opacity}
`;

export const StackedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: row-reverse;

  @keyframes cardAnimation {
    from {
      transform: translate3d(0, 0, 0);
    }

    15% {
      transform: translate3d(-3%, 0, 0) rotate3d(0, 0, 1, -5deg);
    }

    30% {
      transform: translate3d(2%, 0, 0) rotate3d(0, 0, 1, 3deg);
    }

    45% {
      transform: translate3d(-2%, 0, 0) rotate3d(0, 0, 1, -3deg);
    }

    60% {
      transform: translate3d(2%, 0, 0) rotate3d(0, 0, 1, 2deg);
    }

    75% {
      transform: translate3d(-1%, 0, 0) rotate3d(0, 0, 1, -1deg);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

  &:hover {
    animation: cardAnimation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
`;

export const HorizontalBreaker = styled.hr`
  margin: 1rem 0;
  display: block;
  border: none;
  border-bottom: 1px solid ${props => props.color ?? 'inherit'};
  width: 100%;
`;

export const AmountInput = styled.input`
  width: 2rem;
  margin: 0 8px;
  text-align: center;
  height: 1.5rem;
  background-color: inherit;
  border: 1px solid ${({ theme }) => theme.buttonColor};
  color: ${({ theme }) => theme.foreColor};
  border-radius: 3px;
`;
