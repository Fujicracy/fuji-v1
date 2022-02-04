import styled from 'styled-components';
import { size } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { Box } from 'rebass';
import { fujiMedia } from 'consts';

export const DropDownHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  height: 36px;
  color: #f5f5f5;
  box-sizing: border-box;
  border-radius: 19px;
  cursor: pointer;
  padding-left: ${props => (props.leftPadding !== undefined ? props.leftPadding : 16)}px;
  padding-right: ${props => (props.rightPadding !== undefined ? props.rightPadding : 16)}px;

  background: ${props =>
    props.isClicked
      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.07) 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid
    ${props =>
      props.isClicked
        ? themeGet('colors.primary')
        : props.hasBorder
        ? 'rgba(255, 255, 255, 0.1)'
        : 'transparent'};

  &:hover {
    background: ${props =>
      props.isClicked
        ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.07) 100%)'
        : 'rgba(255, 255, 255, 0.15)'};
    border: 1px solid
      ${props => (props.isClicked ? themeGet('colors.primary') : 'rgba(255, 255, 255, 0.1)')};
  }
  ${size}
`;

export const DropDownBackContainer = styled(Box)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 50%;
  transform: translateX(-50%);
  ${fujiMedia.lessThan('small')`
    position: fixed;
    width: 100vw;
    top: 64px;
    backdrop-filter: blur(0.25rem);
  `}
  ${fujiMedia.between('small', 'medium')`
    position: fixed;
    width: 496px !important;
    top: 64px;
    backdrop-filter: blur(0.25rem);
  `}
`;

export const DropDownItemContainer = styled(Box)`
  position: absolute;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  box-sizing: border-box;
  color: #3faffa;
  background-color: #1c1c1c;

  ${fujiMedia.lessThan('small')`
    width: 100vw;
    border-bottom: 1px solid ${themeGet('colors.primary')};
    color: #3faffa;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  `}
  ${fujiMedia.between('small', 'medium')`
    width: 496px !important;
    border: 1px solid ${themeGet('colors.primary')};
    border-top: none;
    color: #3faffa;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  `}
`;

export const DropDownItem = styled(Box)`
  height: 36px;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 16px 0px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${themeGet('colors.text64')};
  &:hover {
    color: #f5f5f5;
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  cursor: pointer;
`;
