import styled from 'styled-components';
import { fontSize, margin } from 'styled-system';

import { NavLink } from 'react-router-dom';
import { Image } from 'rebass';
import { fujiMedia } from 'consts';
import { themeGet } from '@styled-system/theme-get';

export const StoreDecoration = styled(Image)`
  position: absolute;
  right: 40px;

  ${fujiMedia.lessThan('small')`
    right: 20px;
  `}
`;

export const NavigationContainer = styled.ul`
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  margin-bottom: 18px;

  ${fujiMedia.lessThan('small')`
    justify-content: center;
  `}
`;

export const StyledNavLink = styled(NavLink)`
  margin: 0px 12px;
  padding: 8px 16px;

  display: block;
  font-size: 14px;
  line-height: 21px;
  color: white;

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

  ${fujiMedia.greaterThan('small')`
    &.active {
      background: transparent;
      border: none;
      border-bottom: 4px solid ${themeGet('colors.primary')};
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
  width: 172px;
  height: 172px;
`;

export const GearSetItem = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  width: 172px;
  height: 172px;
  background: rgb(18, 18, 18);

  border: 2px solid rgb(58, 58, 58);
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(
    circle 20px at calc(100% - 15px) 15px,
    transparent 30px,
    purple 0
  );
`;

export const GearSetBadge = styled.div`
  width: 43px;
  height: 43px;

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
  align-items: cetner;
  justify-content: center;

  color: rgba(240, 1, 79, 1);
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 2;
`;

export const RotateContainer = styled.div`
  transform: ${props =>
    `translate(${props.left ? '20px, 0' : props.right ? '-20px, 0' : '50%, -10px'})  rotate(${
      props.left ? '-16deg' : props.right ? '16deg' : '0deg'
    })`};
  position: ${props => (props.center ? 'absolute' : 'inherit')};
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

export const PseudoInput = styled.input`
  margin: 0;
  border: none;
  border-radius: 8px;
  background: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  line-height: 36px;
  height: 36px;
  text-align: center;
  max-width: 100%;
`;
