import styled from 'styled-components';
import { fontSize, margin } from 'styled-system';

import { NavLink } from 'react-router-dom';
import { Image } from 'rebass';
import { fujiMedia } from 'consts';
import { themeGet } from '@styled-system/theme-get';
import { Grid } from '@material-ui/core';

export const StoreDecoration = styled(Image)`
  position: absolute;
  right: 40px;

  ${fujiMedia.lessThan('small')`
    right: 20px;
  `}
`;

export const NavigationContainer = styled.ul`
  display: -webkit-box;
  justify-content: flex-start;
  padding: 8px;
  margin-bottom: 18px;

  overflow-x: auto;

  z-index: 0;
`;

export const StyledNavLink = styled(NavLink)`
  margin: 0px 12px;
  padding: 8px 16px;

  display: block;
  font-size: 14px;
  line-height: 21px;
  color: white;

  ${props => props.disabled && `cursor: default;`}

  position: relative;

  &.active {
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid #e9024d;
    box-sizing: border-box;
    border-radius: 30px;
  }

  > span {
    font-size: 14px;
    color: #fe3477;
  }

  &[disabled] {
    color: grey;
    cursor: not-allowed;
  }

  ${fujiMedia.greaterThan('small')`
    padding: 0px 4px 8px;

    &.active {
      background: transparent;
      border: none;
      border-bottom: 2px solid ${themeGet('colors.primary')};
      box-sizing: border-box;
      border-radius: 0px;
    }
  `}
`;

export const HorizontalLine = styled.div`
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 0px 24px;
  width: 100%;

  ${margin};
`;

export const StatsPoints = styled.div`
  font-weight: bold;
  font-size: 32px;
  line-height: 120%;
  color: ${props => (props.color ? props.color : '#fa266c')};

  &:after {
    display: inline-block;
    content: ' ';
    height: 0;
    width: 0;
    border-right: 6px solid transparent;
    border-bottom: 10px solid ${props => (props.color ? props.color : '#fa266c')};
    border-left: 6px solid transparent;
    bottom: 10px;
    position: relative;
    bottom: 8px;
    left: 8px;
  }
  ${fontSize};
  ${margin};
`;

export const StatsBoost = styled(StatsPoints)`
  color: #05ff00;
  &:after {
    display: none;
  }
`;

export const ClimbingSpeedPer = styled.p`
  font-size: 14px;
  line-height: 30px;
  margin-top: 12px;
  & > strong {
    color: #fa266c;
    font-size: 20px;
  }
`;

export const ProfileDecoration = styled.img`
  position: absolute;
  opacity: 0.56;
  top: 74px;
  left: ${props => props.left && '0px'};
  right: ${props => props.right && '0px'};
  transform: ${props => props.right && 'rotateY(0.5turn)'};
`;

export const TiledPanel = styled.div`
  width: 168px;
  height: 256px;
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#7f7eff')};

  background-image: ;
`;

export const GearSetContainer = styled.div`
  position: relative;
  width: ${props => props.width || '229px'};
  height: ${props => props.width || '229px'};

  ${fujiMedia.lessThan('small')`
    width: ${props => props.width || '160px'};
    height: ${props => props.width || '160px'};
  `}
`;

export const GearSetItem = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  width: ${props => props.width || '229px'};
  height: ${props => props.width || '229px'};
  ${fujiMedia.lessThan('small')`
    width: ${props => props.width || '160px'};
    height: ${props => props.width || '160px'};
  `}
  background: rgb(18, 18, 18);

  border: 2px solid rgb(58, 58, 58);
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(
    circle 20px at calc(100% - 15px) 15px,
    transparent 20px,
    purple 0
  );

  transition: 0.3s all;
  ${props =>
    props.hover &&
    `&:hover {
      border: 2px solid #fa266c;
      cursor: pointer;
      & > div {
        // rewrite for GearSetBadge
        background-color: #fa266c;
    }`}
  }
`;

export const GearSetBadge = styled.div`
  width: 43px;
  height: 43px;

  transition: all 0.3s;
  background-color: rgb(58, 58, 58);
  border-radius: 50%;
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 1;
`;

export const GearSetNumber = styled.div`
  width: 43px;
  height: 43px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  color: rgba(240, 1, 79, 1);
  position: absolute;
  right: -8px;
  top: 4px;
  z-index: 2;
`;

export const RotateContainer = styled.div`
  transform: ${props =>
    `translate(${
      props.position === 'left' ? '20px, 0' : props.position === 'right' ? '-20px, 0' : '0px, -10px'
    }) rotate(${
      props.position === 'left' ? '-16deg' : props.position === 'right' ? '16deg' : '0deg'
    })`};
  position: ${props => (props.position === 'center' ? 'absolute' : 'inherit')};
`;

export const HeaderBackContainer = styled.div`
  position: absolute;
  left: 16px;
`;

export const HightLightBadge = styled.div`
  position: absolute;

  width: 8px;
  height: 8px;
  background: #f0014f;
  border-radius: 50%;
  top: 0;
  right: 0;
`;

export const GridItem = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PseudoInput = styled.input`
  margin: 0;
  border: none;
  border-radius: 8px;
  background: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  line-height: 36px;
  height: 54px;
  text-align: center;
  max-width: 100%;

  border-color: ${props => (props.error ? 'red' : 'black')};
  outline: none;
  &:hover {
    border: none;
    outline: none;
  }

  &:focus,
  &:focus-within {
    border: 1px solid ${themeGet('colors.primary')};
  }
`;
