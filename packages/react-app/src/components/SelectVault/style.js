import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import media from 'styled-media-query';

export const DropDownContainer = styled('div')`
  width: 100%;
`;

export const DropDownHeader = styled('div')`
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 16px 0px 16px;
  color: #f5f5f5;
  cursor: pointer;

  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: ${props => (props.isOpened ? '0px' : '6px')};
  border-bottom-left-radius: ${props => (props.isOpened ? '0px' : '6px')};

  ${media.lessThan('medium')`
    font-size: 12px;
    height: 40px;
  `}
`;

// const breatheAnimation = keyframes`
//  0% { height: 0px; opacity: 0.7;}
//  100% { height: 100px; opacity: 0.1; }
// `;
export const DropDownListContainer = styled('div')`
  overflow-y: auto;

  &::-webkit-scrollbar {
    background-color: rgba(255, 255, 255, 0.05);
    width: 24px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.05);
    border: 8px solid rgba(255, 255, 255, 0.1);
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background-clip: padding-box;
    border: 8px solid rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

export const DropDownList = styled('ul')`
  padding: 0;
  margin: 0;
  border: none;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 16px;
  font-weight: 500;
  &:first-child {
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  cursor: pointer;
  ${media.lessThan('medium')`
    font-size: 12px;
  `}
`;

export const ListItem = styled('li')`
  list-style: none;
  height: 56px;
  font-size: 16px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 0px 16px 0px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: ${themeGet('colors.text32')};
  &:hover {
    color: #f5f5f5;
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  ${media.lessThan('medium')`
    font-size: 12px;
    height: 40px;
  `}
`;
